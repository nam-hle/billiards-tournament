import { type Player } from "@/interfaces/player.interface";
import { Match, type BaseMatch } from "@/interfaces/match.interface";
import { type WithScheduled } from "@/interfaces/scheduled-match.interface";
import { type WithDefinedPlayers } from "@/interfaces/defined-players-match.interface";

export type WithCompleted<M extends BaseMatch> = M & WithDefinedPlayers<M> & WithScheduled<M> & { score1: number; score2: number };

export type CompletedMatch = WithCompleted<Match>;
export namespace CompletedMatch {
	export function isInstance<M extends BaseMatch>(match: M): match is WithCompleted<M> {
		return match.score1 !== undefined && match.score2 !== undefined && [match.score1, match.score2].includes(Match.getRaceScore(match));
	}

	export function getWinner(match: CompletedMatch): Player {
		return isWinner(match, match.player1.id) ? match.player1 : match.player2;
	}

	export function isWinner(match: CompletedMatch, playerId: string): boolean {
		if (!Match.hasPlayer(match, playerId)) {
			throw new Error(`Player ID "${playerId}" not found in match with players "${match.player1.id}" and "${match.player2.id}"`);
		}

		return getWinnerId(match) === playerId;
	}

	export function getWinnerId(match: CompletedMatch): string {
		if (match.score1 > match.score2) {
			return match.player1.id;
		}

		if (match.score2 > match.score1) {
			return match.player2.id;
		}

		throw new Error("Match is a draw, cannot determine winner ID");
	}

	export function getLoserId(match: CompletedMatch): string {
		return getWinnerId(match) === match.player1.id ? match.player2.id : match.player1.id;
	}

	export function getLoserRackWins(match: CompletedMatch): number {
		if (match.score1 > match.score2) {
			return match.score2;
		}

		if (match.score2 > match.score1) {
			return match.score1;
		}

		throw new Error("Match is a draw, cannot determine loser racks won");
	}

	export function getWinnerRackWins(match: CompletedMatch): number {
		if (match.score1 > match.score2) {
			return match.score1;
		}

		if (match.score2 > match.score1) {
			return match.score2;
		}

		throw new Error("Match is a draw, cannot determine loser racks won");
	}

	export function getRackWins(match: CompletedMatch, playerId: string): number {
		if (match.player1.id === playerId) {
			return match.score1;
		}

		if (match.player2.id === playerId) {
			return match.score2;
		}

		throw new Error(`Player ID "${playerId}" not found in match with players "${match.player1.id}" and "${match.player2.id}"`);
	}

	export function getRackLosses(match: CompletedMatch, playerId: string): number {
		if (match.player1.id === playerId) {
			return match.score2;
		}

		if (match.player2.id === playerId) {
			return match.score1;
		}

		throw new Error(`Player ID "${playerId}" not found in match with players "${match.player1.id}" and "${match.player2.id}"`);
	}
}
