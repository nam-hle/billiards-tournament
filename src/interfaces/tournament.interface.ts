import { type Match } from "@/interfaces/match.interface";
import { type Player } from "@/interfaces/player.interface";
import { type Group, type GroupSummary } from "@/interfaces/group.interface";
import { type CompletedMatch } from "@/interfaces/completed-match.interface";
import { type ScheduledMatch } from "@/interfaces/scheduled-match.interface";

export interface Tournament {
	id: string;
	name: string;
	year: string;
	venue: string;
	description: string;

	endDate: string;
	startDate: string;
}
export type TournamentStatus = "upcoming" | "ongoing" | "completed";
export interface TournamentOverview extends Tournament {
	totalGroups: number;
	totalPlayers: number;
	totalMatches: number;
	completedMatches: number;
	status: TournamentStatus;
}

export interface TournamentData {
	groups: GroupSummary[];
	overview: TournamentOverview;
	recentMatches: CompletedMatch[];
	upcomingMatches: ScheduledMatch[];
	topPlayers: Array<{ name: string; wins: number; points: number }>;
}

export interface TournamentSchedule extends Tournament {
	matches: Match[];
	players: Player[];
	groups: Pick<Group, "id" | "name">[];
}

export interface TournamentSummary extends Tournament {
	totalGroups: number;
	totalPlayers: number;
}
