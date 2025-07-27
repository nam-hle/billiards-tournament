import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import {
	Match,
	ISOTime,
	CompletedMatch,
	ScheduledMatch,
	type Tournament,
	type GroupSummary,
	type TournamentData,
	type PlayerAchievement,
	type TournamentSummary,
	type TournamentOverview,
	type TournamentSchedule,
	PlayerAchievementDescriptionMap
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

		return Promise.all(groups.map(async (group) => groupRepository.getSummary({ year, groupId: group.id })));
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
			.filter((match): match is ScheduledMatch => ScheduledMatch.isInstance(match) && new Date(match.scheduledAt) > new Date())
			.sort((a, b) => ISOTime.createComparator("asc")(a.scheduledAt, b.scheduledAt))
			.slice(0, 5);

		const completedMatches = matches.filter(CompletedMatch.isInstance);

		const comparator = ISOTime.createComparator("desc");
		const recentMatches = completedMatches.sort((a, b) => comparator(a.scheduledAt, b.scheduledAt)).slice(0, 5);

		const playersRepo = new PlayerRepository();

		const topPlayers = (
			await Promise.all(
				groups.map(async (group) => {
					const standings = await new GroupRepository().getStandings({ year, groupId: group.id });

					return Promise.all(
						standings.map(async (standing) => {
							const player = await playersRepo.getById(standing.playerId);

							return { ...standing, id: player.id, name: player.name };
						})
					);
				})
			)
		)
			.flat()
			.sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name))
			.slice(0, 5)
			.map((player) => {
				return { id: player.id, name: player.name, wins: player.wins, points: player.points };
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

	async getPlayerTournamentAchievements(params: { year: string; playerId: string }): Promise<PlayerAchievement[]> {
		const matches = await new MatchRepository().getAllByYear(params);

		const tournament = await this.getByYear(params.year);

		if (!matches.every(CompletedMatch.isInstance)) {
			// TODO: We still can compute results before the tournament is completed
			return [];
		}

		const joinedMatches = matches.filter((match) => Match.hasPlayer(match, params.playerId));
		const [finalMatch, semiFinalMatch, quarterFinalMatch] = ["final", "semi-final", "quarter-final"].map((type) =>
			joinedMatches.find((match) => match.type === type)
		);

		if (finalMatch) {
			if (CompletedMatch.getWinnerId(finalMatch) === params.playerId) {
				return [{ ...PlayerAchievementDescriptionMap.champion, tournamentName: tournament.name }];
			}

			return [{ ...PlayerAchievementDescriptionMap["runner-up"], tournamentName: tournament.name }];
		}

		if (semiFinalMatch) {
			return [{ ...PlayerAchievementDescriptionMap["semi-finalist"], tournamentName: tournament.name }];
		}

		if (quarterFinalMatch) {
			return [{ ...PlayerAchievementDescriptionMap["quarter-finalist"], tournamentName: tournament.name }];
		}

		const groupMatch = joinedMatches.find((match) => match.type === "group");

		if (groupMatch) {
			return [{ ...PlayerAchievementDescriptionMap["group-stage"], tournamentName: tournament.name }];
		}

		return [];
	}
}
