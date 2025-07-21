import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { Match, type Tournament, type GroupSummary, type ScheduleMatch, type TournamentSummary, type TournamentSchedule } from "@/interfaces";

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

	public async getSchedule(year: string): Promise<TournamentSchedule> {
		const tournament = await this.getByYear(year);
		const groups = await new GroupRepository().getByYear({ year });

		const matches = await new MatchRepository().getAllByYear({ year });

		const playerRepo = new PlayerRepository();

		const scheduleMatches = await Promise.all(
			matches.map<Promise<ScheduleMatch>>(async (match) => {
				const group = groups.find((g) => g.id === match.groupId);

				assert(group, `Group with ID ${match.groupId} not found for match ${match.id}`);

				const player1 = await playerRepo.getById(match.player1Id);
				const player2 = await playerRepo.getById(match.player1Id);

				return {
					...match,
					groupName: group.name,
					player1: { id: player1.id, name: player1?.name },
					player2: { id: player2.id, name: player2?.name },
					status: Match.isCompleted(match) ? "completed" : "scheduled"
				};
			})
		);

		return { ...tournament, matches: scheduleMatches, groups: groups.map((g) => g.id) };
	}
}
