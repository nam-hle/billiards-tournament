import { combineComparators } from "@/utils/comparator";
import { Match, type GroupMatch } from "@/interfaces/match.interface";
import { CompletedMatch } from "@/interfaces/completed-match.interface";

export type GroupStatus = "ongoing" | "completed" | "upcoming";

export interface Group {
	id: string;
	name: string;
	players: string[];
}

export interface GroupSummary extends Group {
	status: GroupStatus;
	matches: GroupMatch[];
	completedMatches: number;
	leader: { name: string; points: number } | null;
}

export interface GroupStanding {
	wins: number;
	losses: number;
	points: number;
	played: number;
	playerId: string;
	playerName: string;

	matchesWins: number;
	matchesLosses: number;
}
export namespace GroupStanding {
	export function createComparator(matches: Match[]) {
		return combineComparators<GroupStanding>(
			(a, b) => b.points - a.points,
			(a, b) => b.matchesWins - b.matchesLosses - (a.matchesWins - a.matchesLosses),
			(a, b) => b.wins - a.wins,
			(a, b) => {
				const match = Match.findHeadMatch(matches, a.playerId, b.playerId);

				if (!match || !CompletedMatch.isInstance(match)) {
					return 0;
				}

				if (CompletedMatch.getWinnerId(match) === a.playerId) {
					return -1;
				}

				if (CompletedMatch.getWinnerId(match) === b.playerId) {
					return 1;
				}

				return 0;
			},
			(a, b) => a.playerName.localeCompare(b.playerName)
		);
	}
}
