import { combineComparators } from "@/utils/comparator";
import { type Player } from "@/interfaces/player.interface";
import { Match, type GroupMatch } from "@/interfaces/match.interface";
import { CompletedMatch } from "@/interfaces/completed-match.interface";

export type GroupStatus = "ongoing" | "completed" | "upcoming";

export interface Group {
	id: string;
	name: string;
	players: Player[];
}

export interface GroupSummary extends Group {
	status: GroupStatus;
	matches: GroupMatch[];
	completedMatches: number;
	leader: Player & { points: number };
}

export interface GroupStanding {
	player: Player;
	groupId: string;
	groupName: string;
	groupPosition: number;

	points: number;
	matchWins: number;
	matchLosses: number;
	completedMatches: CompletedMatch[];

	rackWins: number;
	rackLosses: number;
	racksDifference: number;

	top1Prob: number;
	top2Prob: number;
}
export namespace GroupStanding {
	export function createComparator(matches: Match[], options?: { orderAlphabetical?: boolean }) {
		const orderAlphabetically = options?.orderAlphabetical ?? true;

		return combineComparators<GroupStanding>(
			(a, b) => b.points - a.points,
			(a, b) => b.rackWins - b.rackLosses - (a.rackWins - a.rackLosses),
			(a, b) => b.rackWins - a.rackWins,
			(a, b) => {
				const match = Match.findHeadMatch(matches, a.player.id, b.player.id);

				if (!match || !CompletedMatch.isInstance(match)) {
					return 0;
				}

				if (CompletedMatch.isWinner(match, a.player.id)) {
					return -1;
				}

				if (CompletedMatch.isWinner(match, b.player.id)) {
					return 1;
				}

				return 0;
			},
			(a, b) => (orderAlphabetically ? a.player.name.localeCompare(b.player.name) : 0)
		);
	}
}
