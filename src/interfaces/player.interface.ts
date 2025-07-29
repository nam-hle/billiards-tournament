import { type Group } from "@/interfaces/group.interface";
import { type CompletedMatch } from "@/interfaces/completed-match.interface";

export interface Player {
	id: string;
	name: string;
	nickname?: string;
	location?: string;
}

export interface PlayerTournamentStat extends Player {
	eloRating: number;

	group: Group;

	matchWins: number;
	matchLosses: number;
	playedMatches: number;

	matchWinRate: number;
	status: "active" | "eliminated" | "qualified";
}
export interface PlayerStat extends Player {
	rank: number;
	eloRating: number;

	matchWins: number;
	matchLosses: number;
	totalMatches: number;

	racksWinRate: number;
	matchWinRate: number;

	tournaments: number;

	maxStreak: number;
	runnerUps: number;
	semiFinals: number;
	championships: number;
	quarterFinals: number;

	recentMatches: CompletedMatch[];
	achievements: PlayerAchievement[];
}

export type PlayerAchievementType = "champion" | "runner-up" | "semi-finalist" | "quarter-finalist" | "group-stage";
export const PlayerAchievementDescriptionMap: Record<
	PlayerAchievementType,
	{ icon: string; title: string; description: string; type: PlayerAchievementType }
> = {
	champion: {
		icon: "crown",
		type: "champion",
		title: "Champion",
		description: "Crowned champion after a series of outstanding performances."
	},
	"semi-finalist": {
		icon: "trophy",
		type: "semi-finalist",
		title: "Semi-finalist",
		description: "Advanced to the semifinals, showcasing consistency and skill."
	},
	"group-stage": {
		icon: "users",
		type: "group-stage",
		title: "Group Stage Competitor",
		description: "Competed with determination during the group stage matches."
	},
	"runner-up": {
		icon: "medal",
		type: "runner-up",
		title: "Runner-up",
		description: "Reached the final and delivered a strong performance throughout the tournament."
	},
	"quarter-finalist": {
		icon: "shield-check",
		type: "quarter-finalist",
		title: "Quarter-finalist",
		description: "Reached the quarterfinals, proving a solid and competitive performance."
	}
};
export interface PlayerAchievement {
	readonly type: PlayerAchievementType;

	readonly icon?: string;
	readonly title: string;
	readonly description: string;

	readonly tournamentName: string;
}
