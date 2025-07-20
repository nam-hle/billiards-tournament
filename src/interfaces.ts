export interface Player {
	id: string;
	name: string;
	nickname?: string;
}

export interface Tournament {
	year: string;
	endDate: string;
	startDate: string;
	description?: string;
}

export type RoundType = "group" | "quarter-final" | "semi-final" | "final";

export interface Match {
	id: string;

	round: RoundType;
	groupId?: string;
	scheduledAt?: string;
	completedAt?: string;

	score1?: number;
	score2?: number;
	player1Id: string;
	player2Id: string;
}
export namespace Match {
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

export interface Standing {
	wins: number;
	losses: number;
	points: number;
	played: number;
	playerId: string;

	matchesWins: number;
	matchesLosses: number;
}
