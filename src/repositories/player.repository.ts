import { assert } from "@/utils";
import { Elo } from "@/utils/elo";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";
import {
	Match,
	ISOTime,
	type Player,
	CompletedMatch,
	ScheduledMatch,
	type PlayerStat,
	type PlayerAchievement,
	type PlayerTournamentStat
} from "@/interfaces";

export class PlayerRepository extends BaseRepository {
	public getAll(): Promise<Player[]> {
		return this.dataSource.getPlayers();
	}

	public async findById(id: string): Promise<Player | undefined> {
		const players = await this.getAll();

		return players.find((player) => player.id === id);
	}

	public async getById(id: string): Promise<Player> {
		const player = await this.findById(id);

		assert(player, `Player with ID ${id} not found`);

		return player;
	}

	public async getAllByYear(year: string): Promise<Player[]> {
		const players = await this.getAll();
		const groups = await new GroupRepository().getByYear({ year });
		const groupPlayers = groups.flatMap((group) => group.players);

		return players.filter((player) => groupPlayers.includes(player.id));
	}

	public async getStatsByTournament(id: string, year: string): Promise<PlayerTournamentStat> {
		const player = await this.getById(id);
		const groups = await new GroupRepository().getByYear({ year });
		const matches = (await new MatchRepository().getAllByYear({ year })).filter((match) => match.player1Id === id || match.player2Id === id);
		const completedMatches = matches.filter(CompletedMatch.isInstance);

		const group = groups.find((group) => group.players.includes(id));
		assert(group);

		const wins = completedMatches.filter((match) => CompletedMatch.getWinnerId(match) === id).length;
		const losses = completedMatches.length - wins;
		const { eloRating } = await this.getEloRating(player.id);

		return {
			...player,
			wins,
			group,
			losses,
			eloRating,

			status: "active", // TODO: Determine status based on matches
			playedMatches: completedMatches.length,
			winRate: wins / completedMatches.length
		};
	}

	async getStat(params: { playerId: string }): Promise<PlayerStat> {
		const { playerId } = params;
		const player = await this.getById(playerId);

		const completedMatches = await this.getCompletedMatches({ order: "asc", playerId: params.playerId });

		const totalWins = completedMatches.filter((match) => CompletedMatch.getWinnerId(match) === params.playerId).length;
		const totalLosses = completedMatches.length - totalWins;

		const totalRacksWins = completedMatches.reduce(
			(sum, match) =>
				sum +
				(CompletedMatch.getWinnerId(match) === params.playerId ? CompletedMatch.getWinnerRacksWon(match) : CompletedMatch.getLoserRacksWon(match)),
			0
		);
		const totalRacksLost = completedMatches.reduce(
			(sum, match) =>
				sum +
				(CompletedMatch.getWinnerId(match) === params.playerId ? CompletedMatch.getLoserRacksWon(match) : CompletedMatch.getWinnerRacksWon(match)),
			0
		);

		const accumulatedStreaks = completedMatches.reduce<number[]>((streaks, match, matchIndex) => {
			if (matchIndex === 0) {
				return [CompletedMatch.getWinnerId(match) === playerId ? 1 : 0];
			}

			if (CompletedMatch.getLoserId(match) === playerId) {
				return [...streaks, 0];
			}

			return [...streaks, streaks[streaks.length - 1] + 1];
		}, []);
		const maxStreak = Math.max(...accumulatedStreaks, 0);

		const achievements = await this.getTournamentResults({ playerId });

		const championships = achievements.filter((achievement) => achievement.type === "champion").length;
		const semiFinals = achievements.filter((achievement) => achievement.type === "semi-finalist").length;
		const quarterFinals = achievements.filter((achievement) => achievement.type === "quarter-finalist").length;
		const runnerUps = achievements.filter((achievement) => achievement.type === "runner-up").length;
		const { rank, eloRating } = await this.getEloRating(player.id);

		return {
			...player,
			rank,
			maxStreak,
			totalWins,
			runnerUps,
			eloRating,
			semiFinals,
			totalLosses,
			championships,
			quarterFinals,

			totalTournaments: achievements.length,
			totalMatches: completedMatches.length,

			recentMatches: completedMatches.slice(-5),
			overallWinRate: totalWins / completedMatches.length,
			achievements: await this.getTournamentResults({ playerId }),
			racksWinRate: totalRacksWins / (totalRacksWins + totalRacksLost)
		};
	}

	async getCompletedMatches(params: { limit?: number; playerId: string; order?: "desc" | "asc" }): Promise<CompletedMatch[]> {
		const { limit, playerId, order = "desc" } = params;

		const completedMatches: CompletedMatch[] = [];

		for (const tournament of await new TournamentRepository().getAll()) {
			const matches = await new MatchRepository().getAllByYear({ year: tournament.year });

			completedMatches.push(...matches.filter(CompletedMatch.isInstance).filter((match) => Match.hasPlayer(match, playerId)));
		}

		const comparator = ISOTime.createComparator(order);

		const sortedCompletedMatches = completedMatches.sort((matchA, matchB) => comparator(matchA.scheduledAt, matchB.scheduledAt));

		if (limit === undefined) {
			return sortedCompletedMatches;
		}

		return sortedCompletedMatches.slice(0, limit);
	}

	async getTournamentResults(params: { playerId: string }): Promise<PlayerAchievement[]> {
		const results: PlayerAchievement[] = [];

		for (const tournament of await new TournamentRepository().getAll()) {
			const result = await new TournamentRepository().getPlayerTournamentAchievements({ ...params, year: tournament.year });

			if (result) {
				results.push(...result);
			}
		}

		return results;
	}

	async getEloRating(playerId: string): Promise<{ rank: number; eloRating: number }> {
		const eloRatings = await this.getEloRatings();

		const eloRating = eloRatings[playerId] ?? Elo.DEFAULT_RATING;

		const rank =
			Object.values(eloRatings)
				.sort((a, b) => (b ?? Elo.DEFAULT_RATING) - (a ?? Elo.DEFAULT_RATING))
				.indexOf(eloRating) + 1;

		return { rank, eloRating };
	}

	async getEloRatings(): Promise<Record<string, number | undefined>> {
		const elo = new Elo();

		for (const match of (await new MatchRepository().getAllCompletedMatches()).sort(ScheduledMatch.ascendingComparator)) {
			elo.processMatch(CompletedMatch.getWinnerId(match), CompletedMatch.getLoserId(match));
		}

		return elo.getRatings();
	}
}
