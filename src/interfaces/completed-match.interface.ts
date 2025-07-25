import { Match } from "@/interfaces/match.interface";
import { type WithScheduled } from "@/interfaces/scheduled-match.interface";
import { type WithDefinedPlayers } from "@/interfaces/defined-players-match.interface";

export type WithCompleted<M extends Match> = M & WithDefinedPlayers<M> & WithScheduled<M> & Required<Pick<M, "score1" | "score2">>;

export type CompletedMatch = WithCompleted<Match>;
export namespace CompletedMatch {
	export function isInstance<M extends Match>(match: M): match is WithCompleted<M> {
		return match.score1 !== undefined && match.score2 !== undefined && [match.score1, match.score2].includes(Match.getRaceScore(match));
	}

	export function getWinnerId(match: CompletedMatch): string {
		if (match.score1 > match.score2) {
			return match.player1Id;
		}

		if (match.score2 > match.score1) {
			return match.player2Id;
		}

		throw new Error("Match is a draw, cannot determine winner ID");
	}

	export function getLoserId(match: CompletedMatch): string {
		return getWinnerId(match) === match.player1Id ? match.player2Id : match.player1Id;
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
