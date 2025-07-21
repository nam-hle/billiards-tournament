export interface Player {
	id: string;
	name: string;
	nickname?: string;
}

export interface Tournament {
	name: string;
	year: string;
	description?: string;

	endDate: string;
	startDate: string;
}

export interface TournamentSchedule extends Tournament {
	matches: ScheduleMatch[];
	groups: Pick<Group, "id" | "name">[];
}

export type ScheduleMatch = Match & {
	player1: { id: string; name: string };
	player2: { id: string; name: string };
	status: "scheduled" | "in-progress" | "completed" | "postponed";
};

export interface TournamentSummary extends Tournament {
	totalGroups: number;
	totalPlayers: number;
}

interface DateTime {
	readonly date: string;
	readonly time: string;
}

export interface BaseMatch {
	id: string;

	type: string;
	scheduledAt?: DateTime;

	score1?: number;
	score2?: number;
	player1Id: string;
	player2Id: string;
}
export interface GroupMatch extends BaseMatch {
	type: "group";
	groupId: string;
}
export namespace GroupMatch {
	export function isInstance(match: BaseMatch): match is GroupMatch {
		return match.type === "group";
	}
}
export interface KnockoutMatch extends BaseMatch {
	type: "quarter-final" | "semi-final" | "final";
}
export namespace KnockoutMatch {
	export function isInstance(match: BaseMatch): match is KnockoutMatch {
		return !GroupMatch.isInstance(match);
	}
}
export type Match = GroupMatch | KnockoutMatch;
export namespace Match {
	export function isCompleted(match: Match): boolean {
		return match.score1 != null && match.score2 != null;
	}

	export function getWinnerId(match: Match): string | undefined {
		if (match.score1 == null || match.score2 == null) {
			return undefined;
		}

		if (match.score1 > match.score2) {
			return match.player1Id;
		} else if (match.score2 > match.score1) {
			return match.player2Id;
		}

		return undefined;
	}
}

export interface Group {
	id: string;
	name: string;
	players: string[];
	matches: string[];
}

export interface GroupSummary extends Group {
	completedMatches: number;
	status: "active" | "completed" | "upcoming";
	leader: {
		name: string;
		points: number;
	} | null;
}

export interface Standing {
	wins: number;
	losses: number;
	points: number;
	played: number;
	playerId: string;

	matchesWins: number;
	matchesLosses: number;
}
