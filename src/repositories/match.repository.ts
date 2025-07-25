import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";
import { type Group, GroupMatch, type Match, CompletedMatch } from "@/interfaces";

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
}
