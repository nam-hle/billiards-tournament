import Chance from "chance";

import { Elo } from "@/utils/elo";
import { type ISOTime } from "@/interfaces/iso-time.interface";
import { type PlayerStat } from "@/interfaces/player.interface";
import { type Tournament } from "@/interfaces/tournament.interface";
import { CompletedMatch } from "@/interfaces/completed-match.interface";
import { ScheduledMatch } from "@/interfaces/scheduled-match.interface";
import { DefinedPlayersMatch } from "@/interfaces/defined-players-match.interface";

export type CompletedMatchWithTournament = CompletedMatch & { tournament: Tournament };

export type MatchDetails = Match & {
	readonly player1?: PlayerStat;
	readonly player2?: PlayerStat;
	readonly tournament: Tournament;
	readonly lastMatch?: CompletedMatchWithTournament;
	readonly recentMatches: CompletedMatchWithTournament[];
	readonly headToHeadMatches: CompletedMatchWithTournament[];
	readonly prediction?: {
		player1WinChance: number;
		player2WinChance: number;
	};
};

export interface BaseMatch {
	id: string;

	type: string;
	scheduledAt?: ISOTime;

	score1?: number;
	score2?: number;
	player1Id?: string;
	player2Id?: string;
	placeholder1?: string;
	placeholder2?: string;
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

export type MatchStatus = "scheduling" | "scheduled" | "upcoming" | "waiting" | "in-progress" | "completed";
export namespace Match {
	export function findHeadMatch<M extends Match>(matches: M[], player1Id: string, player2Id: string): M | undefined {
		return matches.find(
			(match) => (match.player1Id === player1Id && match.player2Id === player2Id) || (match.player1Id === player2Id && match.player2Id === player1Id)
		);
	}

	export function hasPlayer(match: Match, playerId: string): boolean {
		return match.player1Id === playerId || match.player2Id === playerId;
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
				return "upcoming";
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

	export function simulate(params: { raceTo: number; player1Id: string; player2Id: string; player2Rating: number; player1Rating: number }) {
		const chance = new Chance();
		const { raceTo, player1Id, player2Id, player2Rating, player1Rating } = params;
		const player1WinRate = Elo.expectedScore(player1Rating, player2Rating);
		let score1 = 0,
			score2 = 0;

		while (score1 < raceTo && score2 < raceTo) {
			if (chance.floating({ min: 0, max: 1 }) < player1WinRate) {
				score1++;
			} else {
				score2++;
			}
		}

		const winnerId = score1 === raceTo ? player1Id : player2Id;
		const loserId = score1 === raceTo ? player2Id : player1Id;

		return { score1, score2, loserId, winnerId };
	}

	export function formatId(match: Match): string {
		return `#${match.id}`;
	}
}
