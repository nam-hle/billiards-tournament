import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import {
	DateTime,
	type Match,
	CompletedMatch,
	ScheduledMatch,
	type Tournament,
	type GroupSummary,
	type TournamentData,
	DefinedPlayersMatch,
	type TournamentSummary,
	type TournamentOverview,
	type TournamentSchedule
} from "@/interfaces";

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
		const players = await playerRepo.getAllByYear(year);

		const scheduleMatches = await Promise.all(
			matches.map<Promise<Match>>(async (match) => {
				const player1Name = match.player1Id ? (await playerRepo.getById(match.player1Id)).name : undefined;
				const player2Name = match.player2Id ? (await playerRepo.getById(match.player2Id)).name : undefined;

				return { ...match, player1Name, player2Name };
			})
		);

		return { ...tournament, players, matches: scheduleMatches, groups: groups.map(({ id, name }) => ({ id, name })) };
	}

	public async getData(year: string): Promise<TournamentData> {
		const tournament = await this.getByYear(year);
		const groups = await this.getGroupSummaries(year);
		const matches = await new MatchRepository().getAllByYear({ year });

		const players = groups.map((group) => group.players).flat();

		const upcomingMatches = matches
			.filter((match): match is ScheduledMatch => ScheduledMatch.isInstance(match) && new Date(match.scheduledAt.date) > new Date())
			.sort((a, b) => DateTime.createComparator("asc")(a.scheduledAt, b.scheduledAt))
			.slice(0, 5);

		const completedMatches = matches.filter(
			(match): match is CompletedMatch => DefinedPlayersMatch.isInstance(match) && CompletedMatch.isInstance(match)
		);

		const comparator = DateTime.createComparator("desc");
		const recentMatches = completedMatches.sort((a, b) => comparator(a.scheduledAt, b.scheduledAt)).slice(0, 5);

		const playersRepo = new PlayerRepository();

		const topPlayers = (
			await Promise.all(
				groups.map(async (group) => {
					const standings = await new GroupRepository().getStandings({ year, groupId: group.id });

					return Promise.all(
						standings.map(async (standing) => {
							const player = await playersRepo.getById(standing.playerId);

							return { ...standing, name: player.name };
						})
					);
				})
			)
		)
			.flat()
			.sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name))
			.slice(0, 5)
			.map((player) => {
				return { name: player.name, wins: player.wins, points: player.points };
			});

		const overview: TournamentOverview = {
			totalGroups: groups.length,
			totalPlayers: players.length,
			totalMatches: matches.length,
			completedMatches: completedMatches.length,
			status: completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "ongoing" : "completed",
			...tournament
		};

		return { groups, overview, topPlayers, recentMatches, upcomingMatches };
	}
}
