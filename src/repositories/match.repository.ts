import { type Match } from "@/interfaces";
import { BaseRepository } from "@/repositories/base.repository";

export class MatchRepository extends BaseRepository {
	async getAllByYear(params: { year: string }): Promise<Match[]> {
		return this.dataSource.getMatches(params);
	}

	async getAllMatchGroup(params: { year: string; groupId: string }): Promise<Match[]> {
		const matches = await this.getAllByYear(params);

		return matches.filter((match) => match.groupId === params.groupId);
	}
}
