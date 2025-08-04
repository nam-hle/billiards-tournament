import { type Match } from "@/interfaces/match.interface";
import { type Player } from "@/interfaces/player.interface";
import { type CompletedMatch } from "@/interfaces/completed-match.interface";
import { type ScheduledMatch } from "@/interfaces/scheduled-match.interface";
import { type GroupSummary, type GroupStanding } from "@/interfaces/group.interface";

export interface Tournament {
	id: string;
	name: string;
	year: string;
	venue: string;
	image: string;
	description: string;

	endTime: string;
	startTime: string;

	googleMapsUrl: string;
}
export type TournamentStatus = "upcoming" | "ongoing" | "completed";

export interface TournamentSummary extends Tournament {
	status: TournamentStatus;

	players: Player[];
	topStandings: GroupStanding[];

	groups: GroupSummary[];

	matches: Match[];
	recentMatches: CompletedMatch[];
	upcomingMatches: ScheduledMatch[];
	completedMatches: CompletedMatch[];
}
