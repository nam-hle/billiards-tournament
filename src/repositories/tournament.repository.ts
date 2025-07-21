import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { type Tournament, type GroupSummary, type TournamentSummary } from "@/interfaces";

export class TournamentRepository extends BaseRepository {
	public getAll(): Promise<Tournament[]> {
		return this.dataSource.getTournaments();
	}

	public async findByYear(year: string): Promise<Tournament | undefined> {
		const tournaments = await this.getAll();

		return tournaments.find((tournament) => tournament.year === year);
	}

	public async getByYear(year: string): Promise<Tournament> {
		const tournament = await this.findByYear(year);

		assert(tournament, `Tournament for year ${year} not found`);

		return tournament;
	}

	public async getInfoByYear(params: { year: string }): Promise<TournamentSummary> {
		const tournament = await this.getByYear(params.year);
		const groups = await new GroupRepository().getByYear(params);
		const totalPlayers = groups.reduce((count, group) => count + group.players.length, 0);

		return { ...tournament, totalPlayers, totalGroups: groups.length };
	}

	public async getGroupSummaries(year: string): Promise<GroupSummary[]> {
		const groupRepository = new GroupRepository();
		const groups = await groupRepository.getByYear({ year });
		const groupSummaries: GroupSummary[] = [];

		for (const group of groups) {
			groupSummaries.push(await groupRepository.getSummary({ year, groupId: group.id }));
		}

		return groupSummaries;
	}
}
