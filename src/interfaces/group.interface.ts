import { type GroupMatch } from "@/interfaces/match.interface";

export interface Group {
	id: string;
	name: string;
	players: string[];
}

export type GroupStatus = "ongoing" | "completed" | "upcoming";
export interface GroupSummary extends Group {
	status: GroupStatus;
	matches: GroupMatch[];
	completedMatches: number;
	leader: { name: string; points: number } | null;
}

export interface Standing {
	wins: number;
	losses: number;
	points: number;
	played: number;
	playerId: string;
	playerName: string;

	matchesWins: number;
	matchesLosses: number;
}
