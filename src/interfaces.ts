export interface Player {
	id: string;
	name: string;
	nickname?: string;
}

export interface Tournament {
	year: number;
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
	winnerId?: string;
}

export interface Group {
	id: string;
	name: string;
	players: string[];
	matches: string[];
}
