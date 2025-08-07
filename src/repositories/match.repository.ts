import { assert } from "@/utils";
import { Elo } from "@/utils/elo";
import { isArray } from "@/utils/arrays";
import { MATCH_SELECT } from "@/constants";
import { supabaseClient } from "@/services/supabase/server";
import { PlayerRepository } from "@/repositories/player.repository";
import {
	Match,
	CompletedMatch,
	type GroupMatch,
	type MatchDetails,
	type WithCompleted,
	type ScheduledMatch,
	DefinedPlayersMatch,
	type WithDefinedPlayers
} from "@/interfaces";

interface MatchQuery {
	limit?: number;
	groupId?: string;
	playerId?: string;
	ascending?: boolean;
	completed?: boolean;
	tournamentId?: string;
}

type MatchResult<Q extends MatchQuery> = Q["completed"] extends true
	? Q["groupId"] extends string
		? WithCompleted<GroupMatch>
		: CompletedMatch
	: Q["groupId"] extends string
		? GroupMatch
		: Match;

export class MatchRepository {
	async query<Q extends MatchQuery>(params?: Q): Promise<MatchResult<Q>[]> {
		let query = supabaseClient.from("matches").select(MATCH_SELECT);

		if (params?.groupId) {
			query = query.eq("group_id", params.groupId);
		}

		if (params?.playerId) {
			query = query.or(`player_id_1.eq.${params.playerId},player_id_2.eq.${params.playerId}`);
		}

		if (params?.tournamentId) {
			query = query.eq("tournament_id", params.tournamentId);
		}

		if (params?.completed) {
			query = query.not("score_1", "is", null).not("score_2", "is", null);
		}

		if (params?.limit) {
			query = query.limit(params.limit);
		}

		const { data, error } = await query.order("scheduled_at", { ascending: params?.ascending ?? true });

		if (error) {
			throw error;
		}

		if (data.every(Match.isInstance)) {
			return data as MatchResult<Q>[];
		}

		throw new Error("Invalid match data: not all matches are completed");
	}

	async getHeadToHeadMatches(params: { player1Id: string; player2Id: string }): Promise<CompletedMatch[]> {
		const { player1Id, player2Id } = params;

		const { data, error } = await supabaseClient
			.from("matches")
			.select(MATCH_SELECT)
			.or(`and(player_id_1.eq.${player1Id},player_id_2.eq.${player2Id}),and(player_id_1.eq.${player2Id},player_id_2.eq.${player1Id})`)
			.not("score_1", "is", null)
			.not("score_2", "is", null);

		if (error) {
			throw error;
		}

		if (!isArray(data, CompletedMatch.isInstance)) {
			throw new Error("Incorrect match data: not all matches are completed");
		}

		return data as CompletedMatch[];
	}

	async getById(params: { matchId: string }): Promise<Match> {
		const { data: match } = await supabaseClient.from("matches").select(MATCH_SELECT).eq("id", params.matchId).single();

		assert(match && Match.isInstance(match), `Match ID ${params.matchId} not found`);

		return match;
	}

	async getDetails(params: { matchId: string }): Promise<MatchDetails> {
		const targetMatch = await this.getById(params);

		if (!DefinedPlayersMatch.isInstance(targetMatch)) {
			return targetMatch;
		}

		const player1Stat = await new PlayerRepository().getOverallStat({ playerId: targetMatch.player1.id });
		const player2Stat = await new PlayerRepository().getOverallStat({ playerId: targetMatch.player2.id });

		return {
			...targetMatch,
			player1Stat,
			player2Stat,
			headToHeadMatches: await this.getHeadToHeadMatches({ player1Id: targetMatch.player1.id, player2Id: targetMatch.player2.id }),
			prediction: {
				player2WinChance: Elo.expectedScore(player2Stat.eloRating, player1Stat.eloRating),
				player1WinChance: Elo.expectedScore(player1Stat.eloRating, player2Stat.eloRating)
			}
		};
	}

	async getUpcomingMatchesByPlayer(params: { playerId: string }): Promise<WithDefinedPlayers<ScheduledMatch>[]> {
		const { data, error } = await supabaseClient
			.from("matches")
			.select(MATCH_SELECT)
			.gt("scheduled_at", new Date().toISOString())
			.or(`player_id_1.eq.${params.playerId},player_id_2.eq.${params.playerId}`)
			.order("scheduled_at", { ascending: true });

		if (error) {
			throw error;
		}

		return data as WithDefinedPlayers<ScheduledMatch>[];
	}
}
