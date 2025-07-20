import { assert } from "@/utils";
import { combineComparators } from "@/utils/comparator";
import { BaseRepository } from "@/repositories/base.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { type Match, type Group, type Standing } from "@/interfaces";

export class GroupRepository extends BaseRepository {
	async find(params: { year: string; groupId: string }): Promise<Group | undefined> {
		const groups = await this.dataSource.getGroups({ year: params.year });

		return groups.find((group) => group.id === params.groupId);
	}

	async get(params: { year: string; groupId: string }): Promise<Group> {
		const group = await this.find(params);

		assert(group, `Group with ID ${params.groupId} not found for year ${params.year}`);

		return group;
	}

	async getStandings(params: { year: string; groupId: string }): Promise<Standing[]> {
		const group = await this.get(params);
		const matches = await new MatchRepository().getAllMatchGroup(params);

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

				if (this.getWinnerId(match) === a.playerId) {
					return -1;
				}

				if (this.getWinnerId(match) === b.playerId) {
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

					if (playerId === this.getWinnerId(match)) {
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

	private getWinnerId(match: Match): string | undefined {
		if (match.score1 == null || match.score2 == null) {
			return undefined;
		}

		if (match.score1 > match.score2) {
			return match.player1Id;
		} else if (match.score2 > match.score1) {
			return match.player2Id;
		}

		return undefined;
	}
}
