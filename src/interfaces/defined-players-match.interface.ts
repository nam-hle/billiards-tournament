import { type Match } from "@/interfaces/match.interface";

export type WithDefinedPlayers<M extends Match> = M & Required<Pick<M, "player1Id" | "player2Id">> & { player1Name: string; player2Name: string };
export type DefinedPlayersMatch = WithDefinedPlayers<Match>;
export namespace DefinedPlayersMatch {
	export function isInstance<M extends Match>(match: M): match is WithDefinedPlayers<M> {
		return (
			match.player1Id !== undefined &&
			match.player2Id !== undefined &&
			"player1Name" in match &&
			match.player1Name !== undefined &&
			"player2Name" in match &&
			match.player2Name !== undefined
		);
	}

	export function getOpponentName(match: DefinedPlayersMatch, playerId: string): string {
		if (match.player1Id === playerId) {
			return match.player2Name;
		}

		if (match.player2Id === playerId) {
			return match.player1Name;
		}

		throw new Error(`Player ID "${playerId}" not found in match with players "${match.player1Name}" and "${match.player2Name}"`);
	}
}
