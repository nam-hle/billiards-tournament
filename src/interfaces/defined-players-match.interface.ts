import { type Player } from "@/interfaces/player.interface";
import { type Match, type BaseMatch } from "@/interfaces/match.interface";

export type WithDefinedPlayers<M extends BaseMatch> = M & { player2: Player; player1: Player };
export type DefinedPlayersMatch = WithDefinedPlayers<Match>;
export namespace DefinedPlayersMatch {
	export function isInstance<M extends Match>(match: M): match is WithDefinedPlayers<M> {
		return match.player1 !== null && match.player2 !== null;
	}

	export function getOpponentName(match: DefinedPlayersMatch, playerId: string): string {
		if (match.player1.id === playerId) {
			return match.player2.name;
		}

		if (match.player2.id === playerId) {
			return match.player1.name;
		}

		throw new Error(`Player ID "${playerId}" not found in match ${JSON.stringify(match)}`);
	}

	export function getOpponentId(match: DefinedPlayersMatch, playerId: string): string {
		if (match.player1.id === playerId) {
			return match.player2.id;
		}

		if (match.player2.id === playerId) {
			return match.player1.id;
		}

		throw new Error(`Player ID "${playerId}" not found in match ${JSON.stringify(match)}`);
	}
}
