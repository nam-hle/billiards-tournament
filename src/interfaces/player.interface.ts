import { type Group } from "@/interfaces/group.interface";

export interface Player {
	id: string;
	name: string;
	nickname?: string;
}
export interface PlayerTournamentStat extends Player {
	group: Group;

	wins: number;
	losses: number;
	playedMatches: number;

	winRate: number;
	status: "active" | "eliminated" | "qualified";
}
