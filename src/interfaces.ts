interface Player {
	id: string;
	name: string;
	nickname?: string;
}

interface Tournament {
	year: number;
	endDate: string;
	startDate: string;
	description?: string;
}

type RoundType = "group" | "quarter-final" | "semi-final" | "final";

interface Match {
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

interface Group {
	id: string;
	name: string;
	players: string[];
	matches: string[];
}
