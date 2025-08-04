import { sumBy } from "es-toolkit";

import { assert } from "@/utils";
import { Elo } from "@/utils/elo";
import { DEFAULT_LIMIT } from "@/constants";
import { supabaseClient } from "@/services/supabase/server";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";
import {
	type Player,
	CompletedMatch,
	ScheduledMatch,
	type WithScheduled,
	DefinedPlayersMatch,
	type PlayerOverallStat,
	type PlayerAchievement,
	type PlayerTournamentStat
} from "@/interfaces";

export class PlayerRepository {
	public async getAll(): Promise<Player[]> {
		const { data } = await supabaseClient.from("players").select("*");

		return data ?? [];
	}

	public async getById(params: { playerId: string }): Promise<Player> {
		const { data: player } = await supabaseClient.from("players").select("*").eq("id", params.playerId).single();

		assert(player, `Player with ID ${params.playerId} not found`);

		return player;
	}

	public async getAllByTournament(params: { tournamentId: string }): Promise<Player[]> {
		const groups = await new GroupRepository().getAllByTournament(params);
		const groupIds = groups.map((group) => group.id);

		const { data: players } = await supabaseClient.from("group_players").select(`player:players (*)`).in("group_id", groupIds);

		return players?.map(({ player }) => player) ?? [];
	}

	public async getTournamentStat(params: { playerId: string; tournamentId: string }): Promise<PlayerTournamentStat> {
		const player = await this.getById(params);
		const completedMatches = await new MatchRepository().query({ ...params, completed: true });

		const matchWins = completedMatches.filter((match) => CompletedMatch.isWinner(match, params.playerId)).length;
		const matchLosses = completedMatches.length - matchWins;
		const rackWins = completedMatches.reduce((sum, match) => sum + CompletedMatch.getRackWins(match, playerId), 0);
		const rackLosses = completedMatches.reduce((sum, match) => sum + CompletedMatch.getRackLosses(match, playerId), 0);
		const { eloRating } = await this.getEloRating({ playerId: player.id });

		return {
			...player,
			eloRating,
			matchWins,
			rackWins,
			matchLosses,
			group: await new GroupRepository().getByPlayer(params),
			rackDiffs: rackWins - rackLosses,

			status: "active", // TODO: Determine status based on matches
			playedMatches: completedMatches.length,
			matchWinRate: matchWins / completedMatches.length
		};
	}

	async getOverallStat(params: { playerId: string; skipLast?: number }): Promise<PlayerOverallStat> {
		const { playerId } = params;
		const player = await this.getById(params);

		const completedMatches = await new MatchRepository().query({ completed: true, playerId: params.playerId });

		const matchWins = completedMatches.filter((match) => CompletedMatch.isWinner(match, params.playerId)).length;
		const matchLosses = completedMatches.length - matchWins;

		const rackWins = sumBy(completedMatches, (match) => CompletedMatch.getRackWins(match, playerId));
		const rackLosses = sumBy(completedMatches, (match) => CompletedMatch.getRackLosses(match, playerId));

		const accumulatedStreaks = completedMatches.reduce<number[]>((streaks, match, matchIndex) => {
			if (matchIndex === 0) {
				return [CompletedMatch.isWinner(match, playerId) ? 1 : 0];
			}

			if (CompletedMatch.getLoserId(match) === playerId) {
				return [...streaks, 0];
			}

			return [...streaks, streaks[streaks.length - 1] + 1];
		}, []);
		const maxStreak = Math.max(...accumulatedStreaks, 0);

		const achievements = await this.getTournamentResults({ playerId });

		return {
			...player,
			...(await this.getEloRating({ ...params, playerId })),
			maxStreak,
			matchWins,
			matchLosses,
			runnerUps: achievements.filter((achievement) => achievement.type === "runner-up").length,
			championships: achievements.filter((achievement) => achievement.type === "champion").length,
			semiFinals: achievements.filter((achievement) => achievement.type === "semi-finalist").length,
			quarterFinals: achievements.filter((achievement) => achievement.type === "quarter-finalist").length,

			totalMatches: completedMatches.length,

			racksWinRate: rackWins / (rackWins + rackLosses),
			matchWinRate: matchWins / completedMatches.length,
			recentMatches: completedMatches.slice(-DEFAULT_LIMIT),
			achievements: await this.getTournamentResults({ playerId })
		};
	}

	async getTournamentResults(params: { playerId: string }): Promise<PlayerAchievement[]> {
		const results: PlayerAchievement[] = [];

		for (const tournament of await new TournamentRepository().getAll()) {
			const result = await new TournamentRepository().getPlayerTournamentAchievements({ ...params, tournamentId: tournament.id });

			results.push(...result);
		}

		return results;
	}

	async getEloRating(params: { playerId: string; skipLast?: number }): Promise<{ rank: number; eloRating: number }> {
		const eloRatings = await this.getEloRatings(params);

		const eloRating = eloRatings[params.playerId];

		return {
			eloRating,
			rank: Object.values(eloRatings)
				.sort((a, b) => b - a)
				.indexOf(eloRating)
		};
	}

	async getEloRatings(params?: { skipLast?: number }): Promise<Record<string, number>> {
		const skipLast = params?.skipLast;
		const players = await this.getAll();
		const elo = new Elo(players.map((player) => player.id));

		for (const match of (await new MatchRepository().query({ completed: true })).slice(0, skipLast ? -skipLast : undefined)) {
			elo.processMatch(CompletedMatch.getWinnerId(match), CompletedMatch.getLoserId(match));
		}

		return elo.getRatings();
	}

	async getUpComingMatchesWithPredictions(params: { playerId: string }): Promise<WithScheduled<DefinedPlayersMatch & { winChance: number }>[]> {
		const matches = await new MatchRepository().getUpcomingMatchesByPlayer(params);
		const playerElo = await this.getEloRating(params);

		return Promise.all(
			matches
				.filter((match) => ScheduledMatch.isInstance(match) && DefinedPlayersMatch.isInstance(match))
				.map(async (match) => {
					const opponentId = DefinedPlayersMatch.getOpponentId(match, params.playerId);
					const opponentElo = await this.getEloRating({ playerId: opponentId });

					return { ...match, winChance: Elo.expectedScore(playerElo.eloRating, opponentElo.eloRating) };
				})
		);
	}
}
