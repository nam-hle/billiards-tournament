import { mapValues } from "es-toolkit";

import { supabaseClient } from "@/services/supabase.service";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { type KnockoutPrediction } from "@/interfaces/prediction.interface";
import { DEFAULT_LIMIT, TOURNAMENT_SELECT, QUARTER_FINALIST_NUM } from "@/constants";
import { GroupRepository, type IncompletedGroupMatch } from "@/repositories/group.repository";
import {
	Match,
	GroupMatch,
	type ISOTime,
	GroupStanding,
	CompletedMatch,
	ScheduledMatch,
	type Tournament,
	type WithCompleted,
	DefinedPlayersMatch,
	type PlayerAchievement,
	type TournamentSummary,
	PlayerAchievementDescriptionMap
} from "@/interfaces";

export class TournamentRepository {
	public async getAll(): Promise<Tournament[]> {
		const { data, error } = await supabaseClient.from("tournaments").select(TOURNAMENT_SELECT).order("year", { ascending: false });

		if (error) {
			throw error;
		}

		return data;
	}

	public async getById(params: { tournamentId: string }): Promise<Tournament> {
		const { data, error } = await supabaseClient.from("tournaments").select(TOURNAMENT_SELECT).eq("id", params.tournamentId).single();

		if (error) {
			throw error;
		}

		return data;
	}

	public async getSummary(params: { tournamentId: string }): Promise<TournamentSummary> {
		const groupRepo = new GroupRepository();

		const tournament = await this.getById(params);
		const groups = await Promise.all((await groupRepo.getAllByTournament(params)).map(async (group) => groupRepo.getSummary({ groupId: group.id })));
		const matches = await new MatchRepository().query(params);

		const upcomingMatches = matches
			.filter((match): match is ScheduledMatch => ScheduledMatch.isInstance(match) && new Date(match.scheduledAt) > new Date())
			.slice(0, DEFAULT_LIMIT);

		const completedMatches = matches.filter(CompletedMatch.isInstance);
		const recentMatches = completedMatches.sort(ScheduledMatch.descendingComparator).slice(0, DEFAULT_LIMIT);

		const topStandings = groups
			.map((group) => group.standings)
			.flat()
			.sort(GroupStanding.createComparator([]))
			.slice(0, DEFAULT_LIMIT);

		return {
			groups,
			matches,
			topStandings,
			recentMatches,
			upcomingMatches,
			completedMatches,
			players: await new PlayerRepository().getAllByTournament(params),
			status: completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "ongoing" : "completed",
			...tournament
		};
	}

	async getTournamentAchievements(params: { playerId: string; tournamentId: string }): Promise<PlayerAchievement[]> {
		const matches = await new MatchRepository().query(params);

		const tournament = await this.getById(params);

		if (!matches.every(CompletedMatch.isInstance)) {
			// TODO: We still can compute results before the tournament is completed
			return [];
		}

		const joinedMatches = matches.filter((match) => Match.hasPlayer(match, params.playerId));
		const [finalMatch, semiFinalMatch, quarterFinalMatch] = ["final", "semi-final", "quarter-final"].map((type) =>
			joinedMatches.find((match) => match.type === type)
		);

		if (finalMatch) {
			if (CompletedMatch.isWinner(finalMatch, params.playerId)) {
				return [{ ...PlayerAchievementDescriptionMap.champion, tournamentName: tournament.name }];
			}

			return [{ ...PlayerAchievementDescriptionMap["runner-up"], tournamentName: tournament.name }];
		}

		if (semiFinalMatch) {
			return [{ ...PlayerAchievementDescriptionMap["semi-finalist"], tournamentName: tournament.name }];
		}

		if (quarterFinalMatch) {
			return [{ ...PlayerAchievementDescriptionMap["quarter-finalist"], tournamentName: tournament.name }];
		}

		const groupMatch = joinedMatches.find((match) => match.type === "group");

		if (groupMatch) {
			return [{ ...PlayerAchievementDescriptionMap["group-stage"], tournamentName: tournament.name }];
		}

		return [];
	}

	async predictKnockout(params: { tournamentId: string }): Promise<KnockoutPrediction> {
		const groups = await new GroupRepository().getAllByTournament(params);

		const allGroupMatches = (await new MatchRepository().query(params)).filter((match) => GroupMatch.isInstance(match));
		const completedGroupMatches = allGroupMatches.filter(CompletedMatch.isInstance);
		const incompletedGroupMatches = allGroupMatches.filter((match): match is IncompletedGroupMatch => {
			return DefinedPlayersMatch.isInstance(match) && !CompletedMatch.isInstance(match);
		});
		const predictions: KnockoutPrediction = {};

		if (incompletedGroupMatches.length === 0) {
			return predictions;
		}

		const SIMULATION_ITERATIONS = 10_000;
		const eloRatings = await new PlayerRepository().getEloRatings();

		const updatePrediction = (target: string, opponent: string, position: string) => {
			predictions[target] ??= { ranksRate: {}, opponentsRate: {} };

			predictions[target].opponentsRate[opponent] ??= 0;
			predictions[target].opponentsRate[opponent] += 1;

			predictions[target].ranksRate[position] ??= 0;
			predictions[target].ranksRate[position] += 1;
		};

		for (let iteration = 0; iteration < SIMULATION_ITERATIONS; iteration++) {
			const simulatedGroupMatches: WithCompleted<GroupMatch>[] = incompletedGroupMatches.map((match) => {
				const { score1, score2 } = Match.simulate({
					player1Id: match.player1.id,
					player2Id: match.player2.id,
					raceTo: Match.getRaceScore(match),
					player2Rating: eloRatings[match.player2.id],
					player1Rating: eloRatings[match.player1.id]
				});

				return { ...match, score1, score2, scheduledAt: "" as ISOTime };
			});

			const allMatches = [...completedGroupMatches, ...simulatedGroupMatches];
			const groupStandings: GroupStanding[][] = [];

			for (const group of groups) {
				groupStandings.push(await new GroupRepository().getStandings({ ...params, group, groupId: group.id, matches: allMatches }));
			}

			const { qualifiedPlayers } = new GroupRepository().computeAdvancedPlayersStrategy(groupStandings, groups);

			Array.from({ length: QUARTER_FINALIST_NUM / 2 }).forEach((_, index) => {
				const [firstPosition, secondPosition] = [index, QUARTER_FINALIST_NUM - 1 - index];
				const [first, second] = [qualifiedPlayers[firstPosition], qualifiedPlayers[secondPosition]];

				updatePrediction(first.player.id, second.player.name, String(firstPosition));
				updatePrediction(second.player.id, first.player.name, String(secondPosition));
			});

			groupStandings.flat().forEach((player) => {
				if (qualifiedPlayers.some((qualifiedPlayer) => qualifiedPlayer.player.id === player.player.id)) {
					return;
				}

				updatePrediction(player.player.id, "Eliminated", "Eliminated");
			});
		}

		return mapValues(predictions, (prediction) => {
			return {
				ranksRate: mapValues(prediction.ranksRate, (positionRate) => positionRate / SIMULATION_ITERATIONS),
				opponentsRate: mapValues(prediction.opponentsRate, (opponentRate) => opponentRate / SIMULATION_ITERATIONS)
			};
		});
	}
}
