import { sumBy } from "es-toolkit";

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
		const { data, error } = await supabaseClient.from("players").select("*");

		if (error) {
			throw error;
		}

		return data;
	}

	public async getById(params: { playerId: string }): Promise<Player> {
		const { data, error } = await supabaseClient.from("players").select("*").eq("id", params.playerId).single();

		if (error) {
			throw error;
		}

		return data;
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
		const rackWins = completedMatches.reduce((sum, match) => sum + CompletedMatch.getRackWins(match, player.id), 0);
		const rackLosses = completedMatches.reduce((sum, match) => sum + CompletedMatch.getRackLosses(match, player.id), 0);
		const { eloRating } = await this.getEloRating({ playerId: player.id });

		return {
			...player,
			rackWins,
			eloRating,
			matchWins,
			matchLosses,
			rackDiffs: rackWins - rackLosses,
			group: await new GroupRepository().getByPlayer(params),

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
				return [+CompletedMatch.isWinner(match, playerId)];
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

			runnerUps: achievements.filter((achievement) => achievement.type === "runner-up").length,
			championships: achievements.filter((achievement) => achievement.type === "champion").length,
			semiFinals: achievements.filter((achievement) => achievement.type === "semi-finalist").length,
			quarterFinals: achievements.filter((achievement) => achievement.type === "quarter-finalist").length,

			matchWins,
			matchLosses,
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
			const result = await new TournamentRepository().getTournamentAchievements({ ...params, tournamentId: tournament.id });

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
		const matches = (await new MatchRepository().query({ completed: true })).slice(0, skipLast ? -skipLast : undefined);

		return new Elo(players.map((player) => player.id)).compute(matches);
	}

	async getUpComingMatchesWithPredictions(params: { playerId: string }): Promise<WithScheduled<DefinedPlayersMatch & { winChance: number }>[]> {
		const matches = await new MatchRepository().getUpcomingMatchesByPlayer(params);
		const playerElo = await this.getEloRating(params);

		return Promise.all(
			matches
				.filter((match) => ScheduledMatch.isInstance(match) && DefinedPlayersMatch.isInstance(match))
				.map(async (match) => {
					const opponentId = DefinedPlayersMatch.getOpponent(match, params.playerId).id;
					const opponentElo = await this.getEloRating({ playerId: opponentId });

					return { ...match, winChance: Elo.expectedScore(playerElo.eloRating, opponentElo.eloRating) };
				})
		);
	}
}
