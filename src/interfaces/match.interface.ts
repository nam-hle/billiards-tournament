import { type DateTime } from "@/interfaces/data-time.interface";
import { CompletedMatch } from "@/interfaces/completed-match.interface";
import { ScheduledMatch } from "@/interfaces/scheduled-match.interface";
import { DefinedPlayersMatch } from "@/interfaces/defined-players-match.interface";

export interface BaseMatch {
	id: string;

	type: string;
	scheduledAt?: DateTime;

	score1?: number;
	score2?: number;
	player1Id?: string;
	player2Id?: string;
}

export interface GroupMatch extends BaseMatch {
	name: string;
	type: "group";
	groupId: string;
}
export namespace GroupMatch {
	export function isInstance(match: BaseMatch): match is GroupMatch {
		return match.type === "group";
	}
}

export interface KnockoutMatch extends BaseMatch {
	name: string;
	order: number;
	type: "quarter-final" | "semi-final" | "final";
}
export namespace KnockoutMatch {
	export function isInstance(match: BaseMatch): match is KnockoutMatch {
		return !GroupMatch.isInstance(match);
	}
}

export type Match = GroupMatch | KnockoutMatch;

export type MatchStatus = "scheduling" | "scheduled" | "waiting" | "in-progress" | "completed";
export namespace Match {
	export function findHeadMatch<M extends Match>(matches: M[], player1Id: string, player2Id: string): M | undefined {
		return matches.find(
			(match) => (match.player1Id === player1Id && match.player2Id === player2Id) || (match.player1Id === player2Id && match.player2Id === player1Id)
		);
	}

	export function hasPlayer(match: Match, playerId: string): boolean {
		return match.player1Id === playerId || match.player2Id === playerId;
	}

	export function getOpponentId(match: Match, playerId: string): string | undefined {
		if (match.player1Id === playerId) {
			return match.player2Id;
		}

		if (match.player2Id === playerId) {
			return match.player1Id;
		}

		return undefined;
	}

	export function getStatus(match: Match): MatchStatus {
		if (DefinedPlayersMatch.isInstance(match)) {
			if (CompletedMatch.isInstance(match)) {
				return "completed";
			}

			if (match.score1 !== undefined && match.score2 !== undefined) {
				return "in-progress";
			}

			if (ScheduledMatch.isInstance(match)) {
				return "scheduled";
			}

			return "scheduling";
		}

		if (ScheduledMatch.isInstance(match)) {
			return "scheduled";
		}

		return "waiting";
	}

	export function getRaceScore(match: BaseMatch): number {
		if (GroupMatch.isInstance(match)) {
			return 5;
		}

		if (KnockoutMatch.isInstance(match)) {
			switch (match.type) {
				case "quarter-final":
					return 7;
				case "semi-final":
					return 9;
				case "final":
					return 11;
				default:
					throw new Error(`Unknown knockout match type: ${match.type}`);
			}
		}

		throw new Error(`Unknown match type: ${match.type}`);
	}
}
