import { type Match } from "@/interfaces/match.interface";

export type WithDefinedPlayers<M extends Match = Match> = M &
	Required<Pick<M, "player1Id" | "player2Id">> & { player1Name: string; player2Name: string };
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
}
