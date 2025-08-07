import { mapValues } from "es-toolkit";

import { supabaseClient } from "@/services/supabase/server";
import { GROUP_SELECT, QUARTER_FINALIST_NUM } from "@/constants";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { type GroupPrediction } from "@/interfaces/prediction.interface";
import { TournamentRepository } from "@/repositories/tournament.repository";
import {
	Match,
	type Group,
	type ISOTime,
	GroupStanding,
	CompletedMatch,
	ScheduledMatch,
	type GroupMatch,
	type GroupSummary,
	type WithCompleted,
	DefinedPlayersMatch,
	type WithDefinedPlayers
} from "@/interfaces";

function postProcessGroupResult(result: {
	id: string;
	name: string;
	group_players: { player: { id: string; name: string; nickname: string | null } }[];
}): Group {
	const { id, name, group_players } = result;

	return { id, name, players: group_players.map(({ player }) => player) };
}

export class GroupRepository {
	private static SIMULATION_ITERATION = 7_000;

	async getAllByTournament(params: { tournamentId: string }): Promise<Group[]> {
		const tournament = await new TournamentRepository().getById(params);
		const { data, error } = await supabaseClient.from("groups").select(GROUP_SELECT).eq("tournament_id", tournament.id);

		if (error) {
			throw error;
		}

		return data.map(postProcessGroupResult);
	}

	async findByName(params: { groupName: string; tournamentId: string }): Promise<Group | null> {
		const tournament = await new TournamentRepository().getById(params);

		const { data, error } = await supabaseClient
			.from("groups")
			.select(GROUP_SELECT)
			.eq("tournament_id", tournament.id)
			.eq("name", params.groupName)
			.single();

		if (error) {
			throw error;
		}

		return postProcessGroupResult(data);
	}

	async getById(params: { groupId: string }): Promise<Group> {
		const { data, error } = await supabaseClient.from("groups").select(GROUP_SELECT).eq("id", params.groupId).single();

		if (error) {
			throw error;
		}

		return postProcessGroupResult(data);
	}

	async getByPlayer(params: { playerId: string; tournamentId: string }): Promise<Group> {
		const { data, error } = await supabaseClient.from("group_players").select(`group:groups (${GROUP_SELECT})`).eq("player_id", params.playerId);

		if (error) {
			throw error;
		}

		const group = data.find((group) => group.group.tournament_id === params.tournamentId)?.group;

		if (!group) {
			throw new Error(`Group for player ID ${params.playerId} in tournament ID ${params.tournamentId} not found`);
		}

		return postProcessGroupResult(group);
	}

	async getSummary(params: { groupId: string }): Promise<GroupSummary> {
		const group = await this.getById(params);
		const matches = await new MatchRepository().query(params);

		const completedMatches = matches.filter((match) => CompletedMatch.isInstance(match));
		const status = completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "ongoing" : "completed";

		const [topPlayer] = await this.getStandings(params);

		return { ...group, status, matches, completedMatches: completedMatches.length, leader: { ...topPlayer.player, points: topPlayer.points } };
	}

	async getStandings(params: {
		group?: Group;
		groupId: string;
		prediction?: boolean;
		matches?: WithCompleted<GroupMatch>[];
	}): Promise<GroupStanding[]> {
		const group = params.group ?? (await this.getById(params));
		const matches = params.matches ?? (await new MatchRepository().query({ ...params, completed: true }));

		const prediction: GroupPrediction =
			params.matches === undefined && params.prediction ? await this.getPrediction({ groupId: params.groupId }) : { top1: {}, top2: {} };

		return group.players
			.map<GroupStanding>((player) => {
				const playerId = player.id;

				let matchWins = 0,
					matchLosses = 0,
					rackWins = 0,
					rackLosses = 0;
				const playerMatches = matches.filter((match) => Match.hasPlayer(match, playerId));

				for (const match of playerMatches) {
					rackWins += CompletedMatch.getRackWins(match, playerId);
					rackLosses += CompletedMatch.getRackLosses(match, playerId);

					if (CompletedMatch.isWinner(match, playerId)) {
						matchWins++;
					} else {
						matchLosses++;
					}
				}

				return {
					player,
					rackWins,
					matchWins,
					rackLosses,
					matchLosses,
					groupPosition: 0,
					groupId: group.id,
					points: matchWins * 3,
					groupName: group.name,
					top1Prob: prediction.top1[playerId],
					top2Prob: prediction.top2[playerId],
					racksDifference: rackWins - rackLosses,
					completedMatches: playerMatches.sort(ScheduledMatch.ascendingComparator)
				};
			})
			.sort(GroupStanding.createComparator(matches))
			.map((standing, index) => ({ ...standing, groupPosition: index + 1 }));
	}

	async getAdvancedPlayers(params: { tournamentId: string }): Promise<(GroupStanding & { knockoutPosition: number })[]> {
		const groups = await this.getAllByTournament(params);
		const groupsStandings = await Promise.all(groups.map((group) => this.getStandings({ ...params, groupId: group.id })));
		const topPlayersNum = Math.floor(QUARTER_FINALIST_NUM / groups.length);
		const topPlayers = groupsStandings.map((standings) => standings.slice(0, topPlayersNum)).flat();
		const matches = await new MatchRepository().query(params);
		const bestsOfRule =
			QUARTER_FINALIST_NUM % groups.length === 0 ? undefined : { bestOf: topPlayersNum, count: QUARTER_FINALIST_NUM - topPlayers.length };

		const comparator = GroupStanding.createComparator(matches);
		const bestsOfPlayers = bestsOfRule
			? groupsStandings
					.map((standings) => standings[bestsOfRule.bestOf])
					.sort(comparator)
					.slice(0, bestsOfRule.count)
			: [];
		const alphabeticalOrderedPlayers = [...topPlayers, ...bestsOfPlayers].sort(comparator);

		const nonAlphabeticalPlayers: (GroupStanding & { knockoutPosition: number })[] = [];
		const nonAlphabeticalComparator = GroupStanding.createComparator(matches, { orderAlphabetical: false });

		for (let index = 0; index < alphabeticalOrderedPlayers.length; index++) {
			const currentPlayer = alphabeticalOrderedPlayers[index];

			if (index === 0) {
				nonAlphabeticalPlayers.push({ ...currentPlayer, knockoutPosition: index + 1 });
				continue;
			}

			const previousPlayer = nonAlphabeticalPlayers[index - 1];

			nonAlphabeticalPlayers.push({
				...currentPlayer,
				knockoutPosition: nonAlphabeticalComparator(currentPlayer, previousPlayer) === 0 ? previousPlayer.knockoutPosition : index + 1
			});
		}

		return nonAlphabeticalPlayers;
	}

	async getPrediction(params: { groupId: string }): Promise<GroupPrediction> {
		const group = await this.getById(params);
		const groupMatches = await new MatchRepository().query(params);
		const incompletedMatches = groupMatches.filter((match): match is IncompletedMatch => {
			return DefinedPlayersMatch.isInstance(match) && !CompletedMatch.isInstance(match);
		});

		const completedMatches = groupMatches.filter(CompletedMatch.isInstance);
		const eloRatings = await new PlayerRepository().getEloRatings();
		const prediction: GroupPrediction = { top2: {}, top1: {} };

		if (incompletedMatches.length === 0) {
			return prediction;
		}

		const N = GroupRepository.SIMULATION_ITERATION / incompletedMatches.length;

		for (let iteration = 0; iteration < GroupRepository.SIMULATION_ITERATION / incompletedMatches.length; iteration++) {
			if (iteration % 1000 === 0) {
				// eslint-disable-next-line no-console
				console.log(`Simulation iteration ${iteration} for group ${params.groupId}`);
			}

			const simulatedMatches: WithCompleted<GroupMatch>[] = incompletedMatches.map((match) => {
				const { score1, score2 } = Match.simulate({
					player1Id: match.player1.id,
					player2Id: match.player2.id,
					raceTo: Match.getRaceScore(match),
					player2Rating: eloRatings[match.player2.id],
					player1Rating: eloRatings[match.player1.id]
				});

				return { ...match, score1, score2, scheduledAt: "" as ISOTime };
			});

			const allMatches = [...completedMatches, ...simulatedMatches];

			const standings = await this.getStandings({ ...params, group, matches: allMatches });

			const [top1Player, top2Player] = standings;

			prediction.top1[top1Player.player.id] = (prediction.top1[top1Player.player.id] || 0) + 1;
			prediction.top2[top2Player.player.id] = (prediction.top2[top2Player.player.id] || 0) + 1;
		}

		prediction.top1 = mapValues(prediction.top1, (value) => value / N);
		prediction.top2 = mapValues(prediction.top2, (value) => value / N);

		return prediction;
	}
}

type IncompletedMatch = GroupMatch & WithDefinedPlayers<GroupMatch>;
