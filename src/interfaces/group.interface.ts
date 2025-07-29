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
	leader: { id: string; name: string; points: number } | undefined;
}

export interface GroupStanding {
	playerId: string;
	groupName: string;
	playerName: string;
	groupPosition: number;

	points: number;
	matchWins: number;
	matchLosses: number;
	totalMatches: number;

	rackWins: number;
	rackLosses: number;
	racksWinRate: number;
	racksDifference: number;

	top1Prob: number;
	top2Prob: number;
}
export namespace GroupStanding {
	export function createComparator(matches: Match[]) {
		return combineComparators<GroupStanding>(
			(a, b) => b.points - a.points,
			(a, b) => b.rackWins - b.rackLosses - (a.rackWins - a.rackLosses),
			(a, b) => b.rackWins - a.rackWins,
			(a, b) => {
				const match = Match.findHeadMatch(matches, a.playerId, b.playerId);

				if (!match || !CompletedMatch.isInstance(match)) {
					return 0;
				}

				if (CompletedMatch.isWinner(match, a.playerId)) {
					return -1;
				}

				if (CompletedMatch.isWinner(match, b.playerId)) {
					return 1;
				}

				return 0;
			},
			(a, b) => a.playerName.localeCompare(b.playerName)
		);
	}
}
