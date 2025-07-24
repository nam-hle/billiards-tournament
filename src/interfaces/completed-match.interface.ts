import { Match } from "@/interfaces/match.interface";
import { type WithScheduled } from "@/interfaces/scheduled-match.interface";
import { type WithDefinedPlayers } from "@/interfaces/defined-players-match.interface";

export type WithCompleteness<M extends WithDefinedPlayers> = M & Required<Pick<M, "scheduledAt" | "score1" | "score2">>;

export type CompletedMatch = WithScheduled<WithCompleteness<WithDefinedPlayers>>;
export namespace CompletedMatch {
	export function isInstance<M extends WithDefinedPlayers>(match: M): match is WithCompleteness<M> {
		return match.score1 !== undefined && match.score2 !== undefined && [match.score1, match.score2].includes(Match.getRaceScore(match));
	}

	export function getWinnerId(match: CompletedMatch): string | undefined {
		if (match.score1 > match.score2) {
			return match.player1Id;
		}

		if (match.score2 > match.score1) {
			return match.player2Id;
		}

		return undefined;
	}

	export function getLoserRacksWon(match: CompletedMatch): number {
		if (match.score1 > match.score2) {
			return match.score2;
		}

		if (match.score2 > match.score1) {
			return match.score1;
		}

		throw new Error("Match is a draw, cannot determine loser racks won");
	}

	export function getWinnerRacksWon(match: CompletedMatch): number {
		if (match.score1 > match.score2) {
			return match.score1;
		}

		if (match.score2 > match.score1) {
			return match.score2;
		}

		throw new Error("Match is a draw, cannot determine loser racks won");
	}
}
