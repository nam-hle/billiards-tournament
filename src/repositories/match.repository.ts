import { assert } from "@/utils";
import { Elo } from "@/utils/elo";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";
import { Match, type Group, GroupMatch, CompletedMatch, ScheduledMatch, type Tournament, type MatchDetails } from "@/interfaces";

export class MatchRepository extends BaseRepository {
	async getAllByYear(params: { year: string }): Promise<Match[]> {
		const matches = await this.dataSource.getMatches(params);

		const groups = await new GroupRepository().getByYear(params);
		const playerRepository = new PlayerRepository();

		return Promise.all(
			matches.map(async (match) => {
				const player1Name = match.player1Id ? (await playerRepository.getById(match.player1Id)).name : undefined;
				const player2Name = match.player2Id ? (await playerRepository.getById(match.player2Id)).name : undefined;

				return { ...match, player1Name, player2Name, name: await this.computeMatchName(match, groups) };
			})
		);
	}

	async getAllMatchesByGroup(params: { year: string; groupId: string }): Promise<GroupMatch[]> {
		const matches = await this.getAllByYear(params);

		return matches.filter((match): match is GroupMatch => GroupMatch.isInstance(match) && match.groupId === params.groupId);
	}

	private async computeMatchName(match: Match, groups: Group[]): Promise<string> {
		if (GroupMatch.isInstance(match)) {
			const group = groups.find((g) => g.id === match.groupId);

			assert(group, `Group with ID ${match.groupId} not found`);

			return group.name;
		}

		if (match.type === "final") {
			return "Final";
		}

		if (match.type === "semi-final") {
			return "Semi Final";
		}

		if (match.type === "quarter-final") {
			return "Quarter Final";
		}

		throw new Error(`Unknown match type: ${JSON.stringify(match)}`);
	}

	async getAllCompletedMatches(): Promise<CompletedMatch[]> {
		const completedMatches: CompletedMatch[] = [];

		for (const tournament of await new TournamentRepository().getAll()) {
			const matches = await new MatchRepository().getAllByYear({ year: tournament.year });

			completedMatches.push(...matches.filter(CompletedMatch.isInstance));
		}

		return completedMatches;
	}

	async getAll(): Promise<Match[]> {
		const matches: Match[] = [];

		for (const tournament of await new TournamentRepository().getAll()) {
			matches.push(...(await this.getAllByYear({ year: tournament.year })));
		}

		return matches;
	}

	async getHeadToHeadMatches(params: { player1Id: string; player2Id: string }): Promise<(CompletedMatch & { tournament: Tournament })[]> {
		const allMatches = await this.getAll();

		return Promise.all(
			allMatches
				.filter(CompletedMatch.isInstance)
				.filter((match) => Match.hasPlayer(match, params.player1Id) && Match.hasPlayer(match, params.player2Id))
				.map(async (match) => {
					const tournament = await this.getTournament({ matchId: match.id });

					return { ...match, tournament };
				})
		);
	}

	async getMatchesByYear(): Promise<{ matches: Match[]; tournament: Tournament }[]> {
		const tournaments = await new TournamentRepository().getAll();
		const results: { matches: Match[]; tournament: Tournament }[] = [];

		for (const tournament of tournaments) {
			results.push({ tournament, matches: await this.getAllByYear({ year: tournament.year }) });
		}

		return results;
	}

	async getTournament(params: { matchId: string }): Promise<Tournament> {
		const matchesByYear = await this.getMatchesByYear();

		for (const { matches, tournament } of matchesByYear) {
			if (matches.some((match) => match.id === params.matchId)) {
				return tournament;
			}
		}

		throw new Error(`Tournament not found for match ID ${params.matchId}`);
	}

	async getById(params: { matchId: string }): Promise<{ match: Match; tournament: Tournament }> {
		const matchesByYear = await this.getMatchesByYear();

		for (const { matches, tournament } of matchesByYear) {
			const match = matches.find((m) => m.id === params.matchId);

			if (match) {
				return { match, tournament };
			}
		}

		throw new Error(`Tournament not found for match ID ${params.matchId}`);
	}

	async getDetails(params: { matchId: string }): Promise<MatchDetails> {
		const { tournament, match: targetMatch } = await this.getById(params);

		const recentMatches = await Promise.all(
			(await this.getAllCompletedMatches())
				.sort(ScheduledMatch.descendingComparator)
				.slice(0, 5)
				.map(async (match) => {
					const tournament = await this.getTournament({ matchId: match.id });

					return { ...match, tournament };
				})
		);

		const player1 = targetMatch.player1Id ? await new PlayerRepository().getStat({ playerId: targetMatch.player1Id }) : undefined;
		const player2 = targetMatch.player2Id ? await new PlayerRepository().getStat({ playerId: targetMatch.player2Id }) : undefined;

		const prediction =
			player1 && player2
				? { player1WinChance: Elo.expectedScore(player1.elo, player2.elo), player2WinChance: Elo.expectedScore(player2.elo, player1.elo) }
				: undefined;

		const headToHeadMatches = player1 && player2 ? await this.getHeadToHeadMatches({ player1Id: player1.id, player2Id: player2.id }) : [];

		return { ...targetMatch, player1, player2, tournament, prediction, recentMatches, headToHeadMatches, lastMatch: recentMatches[0] };
	}
}
