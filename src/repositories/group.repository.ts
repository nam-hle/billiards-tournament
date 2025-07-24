import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import {
	type Group,
	GroupStanding,
	CompletedMatch,
	type GroupMatch,
	type GroupSummary,
	type WithCompleted,
	type WithDefinedPlayers
} from "@/interfaces";

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

		const completedMatches = matches.filter((match) => CompletedMatch.isInstance(match));
		const status = completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "ongoing" : "completed";

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

	async getStandings(params: { year: string; groupId: string }): Promise<GroupStanding[]> {
		const group = await this.get(params);
		const matches = (await new MatchRepository().getAllMatchesByGroup(params)).filter(
			(match): match is WithCompleted<WithDefinedPlayers<GroupMatch>> => {
				return CompletedMatch.isInstance(match);
			}
		);

		const comparator = GroupStanding.createComparator(matches);

		const players = await new PlayerRepository().getAll();

		return group.players
			.map((playerId) => {
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

				return { wins, losses, points, played, playerId, playerName, matchesWins, matchesLosses };
			})
			.sort(comparator);
	}

	async getAdvancedPlayerIds(params: { year: string }): Promise<string[]> {
		const groups = await this.getByYear(params);
		const groupsStandings = await Promise.all(groups.map((group) => this.getStandings({ ...params, groupId: group.id })));

		// TODO: Add tournament rules to determine top players
		const topPlayers = groupsStandings.map((standings) => standings.slice(0, 2)).flat();
		const comparator = GroupStanding.createComparator([]);
		const thirdPlayers = groupsStandings
			.map((standings) => standings[2])
			.sort(comparator)
			.slice(0, 2);

		return [...topPlayers, ...thirdPlayers].map((standing) => standing.playerId);
	}
}
