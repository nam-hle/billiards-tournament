import Chance from "chance";

import { Elo } from "@/utils/elo";
import { type Group } from "@/interfaces/group.interface";
import { type ISOTime } from "@/interfaces/iso-time.interface";
import { type Tournament } from "@/interfaces/tournament.interface";
import { CompletedMatch } from "@/interfaces/completed-match.interface";
import { ScheduledMatch } from "@/interfaces/scheduled-match.interface";
import { DefinedPlayersMatch } from "@/interfaces/defined-players-match.interface";
import { type Player, type PlayerOverallStat } from "@/interfaces/player.interface";

export type MatchDetails = Match & {
	readonly prediction?: MatchPrediction;
	readonly player2Stat?: PlayerOverallStat;
	readonly player1Stat?: PlayerOverallStat;
	readonly headToHeadMatches?: CompletedMatch[];
};

export type MatchPrediction = {
	player1WinChance: number;
	player2WinChance: number;
};

export interface BaseMatch {
	id: string;

	type: string;
	order: number | null;
	tournament: Tournament;
	scheduledAt: ISOTime | null;
	group: Pick<Group, "id" | "name"> | null;

	score1: number | null;
	score2: number | null;
	player1: Player | null;
	player2: Player | null;
	placeholder1: string | null;
	placeholder2: string | null;
}

export interface GroupMatch extends BaseMatch {
	type: "group";
	group: Pick<Group, "id" | "name">;
}
export namespace GroupMatch {
	export function isInstance(match: BaseMatch): match is GroupMatch {
		return match.type === "group" && match.group !== null;
	}
}

export interface KnockoutMatch extends BaseMatch {
	order: number;
	type: "quarter-final" | "semi-final" | "final";
}
export namespace KnockoutMatch {
	export function isInstance(match: BaseMatch): match is KnockoutMatch {
		return !GroupMatch.isInstance(match);
	}
}

export type Match = GroupMatch | KnockoutMatch;

export type MatchStatus = "scheduling" | "scheduled" | "upcoming" | "waiting" | "ongoing" | "completed";
export namespace Match {
	export function isInstance(match: BaseMatch): match is Match {
		return GroupMatch.isInstance(match) || KnockoutMatch.isInstance(match);
	}

	export function getName(match: Match) {
		if (GroupMatch.isInstance(match)) {
			return `Group ${match.group.name}`;
		}

		if (match.type === "final") {
			return "Final";
		}

		if (match.type === "semi-final") {
			return "Semi Final";
		}

		if (match.type === "quarter-final") {
			return "Quarter Final";
		}

		throw new Error(`Unknown match type: ${JSON.stringify(match)}`);
	}

	export function findHeadMatch<M extends Match>(matches: M[], player1Id: string, player2Id: string): M | undefined {
		return matches.find(
			(match) =>
				(match.player1?.id === player1Id && match.player2?.id === player2Id) || (match.player1?.id === player2Id && match.player2?.id === player1Id)
		);
	}

	export function hasPlayer(match: Match, playerId: string): boolean {
		return match.player1?.id === playerId || match.player2?.id === playerId;
	}

	export function getStatus(match: Match): MatchStatus {
		if (DefinedPlayersMatch.isInstance(match)) {
			if (CompletedMatch.isInstance(match)) {
				return "completed";
			}

			if (ScheduledMatch.isInstance(match)) {
				if (new Date(match.scheduledAt).getTime() < new Date().getTime()) {
					return "ongoing";
				}

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
