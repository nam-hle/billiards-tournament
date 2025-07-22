import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { type Group, GroupMatch, type Match } from "@/interfaces";
import { PlayerRepository } from "@/repositories/player.repository";

export class MatchRepository extends BaseRepository {
	async getAllByYear(params: { year: string }): Promise<Match[]> {
		const matches = await this.dataSource.getMatches(params);

		const groups = await new GroupRepository().getByYear(params);
		const playerRepository = new PlayerRepository();

		return Promise.all(
			matches.map(async (match) => {
				const player1 = await playerRepository.getById(match.player1Id);
				const player2 = await playerRepository.getById(match.player2Id);

				return { ...match, player1Name: player1.name, player2Name: player2.name, name: await this.computeMatchName(match, groups) };
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

		throw new Error(`Unknown match type: ${match.type}`);
	}
}
