import { GroupMatch, type Match } from "@/interfaces";
import { BaseRepository } from "@/repositories/base.repository";

export class MatchRepository extends BaseRepository {
	async getAllByYear(params: { year: string }): Promise<Match[]> {
		return this.dataSource.getMatches(params);
	}

	async getAllMatchesByGroup(params: { year: string; groupId: string }): Promise<GroupMatch[]> {
		const matches = await this.getAllByYear(params);

		return matches.filter((match): match is GroupMatch => GroupMatch.isInstance(match) && match.groupId === params.groupId);
	}
}
