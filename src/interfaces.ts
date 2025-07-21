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
	groups: string[];
	matches: ScheduleMatch[];
}

export interface ScheduleMatch extends Match {
	player1: { id: string; name: string };
	player2: { id: string; name: string };
	status: "scheduled" | "in-progress" | "completed" | "postponed";
}

export interface TournamentSummary extends Tournament {
	totalGroups: number;
	totalPlayers: number;
}

export type RoundType = "group" | "quarter-final" | "semi-final" | "final";

interface DateTime {
	readonly date: string;
	readonly time: string;
}

export interface Match {
	id: string;

	round: RoundType;
	groupId?: string;
	completedAt?: string;
	scheduledAt?: DateTime;

	score1?: number;
	score2?: number;
	player1Id: string;
	player2Id: string;
}
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
