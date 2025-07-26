import { mapValues } from "es-toolkit";

import { assert } from "@/utils";
import { Elo } from "@/utils/elo";
import { BaseRepository } from "@/repositories/base.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { type GroupPrediction } from "@/interfaces/prediction.interface";
import { TournamentRepository } from "@/repositories/tournament.repository";
import {
	Match,
	type Group,
	type DateTime,
	GroupStanding,
	CompletedMatch,
	type GroupMatch,
	type GroupSummary,
	type WithCompleted,
	DefinedPlayersMatch,
	type WithDefinedPlayers
} from "@/interfaces";

export class GroupRepository extends BaseRepository {
	private static SIMULATION_ITERATION = 10_000;

	async getByYear(params: { year: string }): Promise<Group[]> {
		return this.dataSource.getGroups(params);
	}

	async find(params: { year: string; groupId: string }): Promise<Group | undefined> {
		const groups = await this.getByYear(params);

		return groups.find((group) => group.id === params.groupId);
	}

	async get(params: { year: string; groupId: string }): Promise<Group> {
		const group = await this.find(params);

		assert(group, `Group with ID ${params.groupId} not found for year ${params.year}`);

		return group;
	}

	async getSummary(params: { year: string; groupId: string }): Promise<GroupSummary> {
		const group = await this.get(params);
		const matches = await new MatchRepository().getAllMatchesByGroup(params);
		const playerRepository = new PlayerRepository();

		const completedMatches = matches.filter((match) => CompletedMatch.isInstance(match));
		const status = completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "ongoing" : "completed";

		const [topPlayer] = await this.getStandings(params);
		const leader = { id: topPlayer.playerId, points: topPlayer.points, name: (await playerRepository.getById(topPlayer.playerId)).name };

		return {
			leader,
			status,
			matches,
			id: group.id,
			name: group.name,
			players: group.players,
			completedMatches: completedMatches.length
		};
	}

	async getStandings(params: { year: string; groupId: string; matches?: WithCompleted<GroupMatch>[] }): Promise<GroupStanding[]> {
		const group = await this.get(params);
		const matches =
			params.matches ??
			(await new MatchRepository().getAllMatchesByGroup(params)).filter((match): match is WithCompleted<WithDefinedPlayers<GroupMatch>> =>
				CompletedMatch.isInstance(match)
			);

		const comparator = GroupStanding.createComparator(matches);
		const players = await new PlayerRepository().getAll();

		const prediction =
			params.matches === undefined
				? await this.getPrediction({ year: params.year, groupId: params.groupId })
				: { top1: {}, top2: {}, groupId: params.groupId };

		return group.players
			.map<GroupStanding>((playerId) => {
				const playerName = players.find((player) => player.id === playerId)?.name;
				assert(playerName, `Player with ID ${playerId} not found in group ${group.id}`);

				let wins = 0,
					losses = 0,
					points = 0,
					played = 0,
					matchesWins = 0,
					matchesLosses = 0;

				for (const match of matches) {
					if (match.player1Id !== playerId && match.player2Id !== playerId) {
						continue;
					}

					played++;

					if (!CompletedMatch.isInstance(match)) {
						continue;
					}

					if (playerId === CompletedMatch.getWinnerId(match)) {
						points += 3;
						wins++;
						matchesWins += CompletedMatch.getWinnerRacksWon(match);
						matchesLosses += CompletedMatch.getLoserRacksWon(match);
					} else {
						losses++;
						matchesWins += CompletedMatch.getLoserRacksWon(match);
						matchesLosses += CompletedMatch.getWinnerRacksWon(match);
					}
				}

				return {
					wins,
					losses,
					points,
					played,
					playerId,
					playerName,
					matchesWins,
					matchesLosses,
					groupPosition: 0,
					groupName: group.name,
					top1Prob: prediction.top1[playerId],
					top2Prob: prediction.top2[playerId],
					racksWinRate: (matchesWins / (matchesWins + matchesLosses)) * 100
				};
			})
			.sort(comparator)
			.map((standing, index) => ({ ...standing, groupPosition: index + 1 }));
	}

	async getAdvancedPlayers(params: { year: string }): Promise<GroupStanding[]> {
		const groups = await this.getByYear(params);
		const groupsStandings = await Promise.all(groups.map((group) => this.getStandings({ ...params, groupId: group.id })));

		const tournamentInfo = await new TournamentRepository().getInfoByYear(params);

		const topPlayers = groupsStandings
			.map((standings) =>
				tournamentInfo.knockoutAdvanceRules.flatMap((rule) => {
					return "top" in rule ? standings.slice(0, rule.top) : [];
				})
			)
			.flat();

		const comparator = GroupStanding.createComparator([]);
		const bestsOfRule = tournamentInfo.knockoutAdvanceRules.find((rule) => "bestsOf" in rule);
		const bestsOfPlayers = bestsOfRule
			? groupsStandings
					.map((standings) => standings[bestsOfRule.bestsOf])
					.sort(comparator)
					.slice(0, bestsOfRule.count)
			: [];

		return [...topPlayers, ...bestsOfPlayers].sort(comparator);
	}

	async updatePrediction(params: { year: string }): Promise<void> {
		const groups = await this.getByYear(params);
		const predictions = await Promise.all(groups.map((group) => this.computePrediction({ year: params.year, groupId: group.id })));

		await this.dataSource.updatePredictions({ ...params, predictions });
	}

	async getPrediction(params: { year: string; groupId: string }): Promise<GroupPrediction> {
		const prediction = (await this.dataSource.getPredictions(params)).find((p) => p.groupId === params.groupId);

		if (!prediction) {
			return this.computePrediction(params);
		}

		return prediction;
	}

	async computePrediction(params: { year: string; groupId: string }): Promise<GroupPrediction> {
		const groupMatches = await new MatchRepository().getAllMatchesByGroup(params);
		const incompletedMatches = groupMatches.filter((match): match is IncompletedMatch => {
			return DefinedPlayersMatch.isInstance(match) && !CompletedMatch.isInstance(match);
		});

		const completedMatches = groupMatches.filter(CompletedMatch.isInstance);
		const eloRatings = await new PlayerRepository().getEloRatings();
		const prediction: GroupPrediction = { top2: {}, top1: {}, groupId: params.groupId };

		for (let iteration = 0; iteration < GroupRepository.SIMULATION_ITERATION; iteration++) {
			if (iteration % 1000 === 0) {
				console.log(`Simulation iteration ${iteration} for group ${params.groupId} of year ${params.year}`);
			}

			const simulatedMatches: WithCompleted<GroupMatch>[] = incompletedMatches.map((match) => {
				const { score1, score2 } = Match.simulate({
					player1Id: match.player1Id,
					player2Id: match.player2Id,
					raceTo: Match.getRaceScore(match),
					player2Rating: eloRatings[match.player2Id] ?? Elo.DEFAULT_RATING,
					player1Rating: eloRatings[match.player1Id] ?? Elo.DEFAULT_RATING
				});

				return { ...match, score1, score2, scheduledAt: {} as DateTime };
			});

			const allMatches = [...completedMatches, ...simulatedMatches];

			const standings = await this.getStandings({ ...params, matches: allMatches });

			const [top1Player, top2Player] = standings;

			prediction.top1[top1Player.playerId] = (prediction.top1[top1Player.playerId] || 0) + 1;
			prediction.top2[top2Player.playerId] = (prediction.top2[top2Player.playerId] || 0) + 1;
		}

		prediction.top1 = mapValues(prediction.top1, (value) => value / GroupRepository.SIMULATION_ITERATION);
		prediction.top2 = mapValues(prediction.top2, (value) => value / GroupRepository.SIMULATION_ITERATION);

		return prediction;
	}
}

type IncompletedMatch = GroupMatch & WithDefinedPlayers<GroupMatch>;
