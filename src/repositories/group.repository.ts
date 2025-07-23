import { assert } from "@/utils";
import { combineComparators } from "@/utils/comparator";
import { BaseRepository } from "@/repositories/base.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { type Group, type Standing, CompletedMatch, type GroupMatch, type GroupSummary, type WithCompleteness } from "@/interfaces";

export class GroupRepository extends BaseRepository {
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

		const completedMatches = matches.filter(CompletedMatch.isInstance);
		const status = completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "active" : "completed";

		const [topPlayer] = await this.getStandings(params);
		const leader = status === "upcoming" ? null : { points: topPlayer.points, name: (await playerRepository.getById(topPlayer.playerId)).name };

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

	async getStandings(params: { year: string; groupId: string }): Promise<Standing[]> {
		const group = await this.get(params);
		const matches = (await new MatchRepository().getAllMatchesByGroup(params)).filter((match): match is WithCompleteness<GroupMatch> => {
			return CompletedMatch.isInstance(match);
		});

		const findHeadMatch = (player1Id: string, player2Id: string) => {
			return matches.find(
				(match) =>
					(match.player1Id === player1Id && match.player2Id === player2Id) || (match.player1Id === player2Id && match.player2Id === player1Id)
			);
		};

		const comparator = combineComparators<Standing>(
			(a, b) => b.points - a.points,
			(a, b) => b.matchesWins - b.matchesLosses - (a.matchesWins - a.matchesLosses),
			(a, b) => b.wins - a.wins,
			(a, b) => {
				const match = findHeadMatch(a.playerId, b.playerId);

				if (!match) {
					return 0;
				}

				if (CompletedMatch.getWinnerId(match) === a.playerId) {
					return -1;
				}

				if (CompletedMatch.getWinnerId(match) === b.playerId) {
					return 1;
				}

				return 0;
			}
		);

		return group.players
			.map((playerId) => {
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

					if (match.score1 == null || match.score2 == null) {
						continue;
					}

					matchesWins += match.score1;
					matchesLosses += match.score2;

					if (playerId === CompletedMatch.getWinnerId(match)) {
						points += 3;
						wins++;
					} else {
						losses++;
					}
				}

				return { wins, losses, points, played, playerId, matchesWins, matchesLosses };
			})
			.sort(comparator);
	}
}
