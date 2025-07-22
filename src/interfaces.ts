export interface Player {
	id: string;
	name: string;
	nickname?: string;
}

export interface Tournament {
	name: string;
	year: string;
	venue: string;
	description: string;

	endDate: string;
	startDate: string;
}
export interface TournamentOverview extends Tournament {
	totalGroups: number;
	totalPlayers: number;
	totalMatches: number;
	completedMatches: number;
	status: "upcoming" | "active" | "completed";
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

export type WithCompleteness<M extends BaseMatch> = M & Required<Pick<Match, "scheduledAt" | "score1" | "score2">>;

export type CompletedMatch = WithCompleteness<Match>;
export namespace CompletedMatch {
	export function isInstance<M extends Match>(match: M): match is WithCompleteness<M> {
		return match.score1 !== undefined && match.score2 !== undefined && match.scheduledAt !== undefined;
	}

	export function getWinnerId(match: CompletedMatch): string | undefined {
		if (match.score1 > match.score2) {
			return match.player1Id;
		}

		if (match.score2 > match.score1) {
			return match.player2Id;
		}

		return undefined;
	}
}

export interface TournamentSummary extends Tournament {
	totalGroups: number;
	totalPlayers: number;
}

interface DateTime {
	readonly date: string;
	readonly time: string;
}
export namespace DateTime {
	export function createComparator(order: "asc" | "desc") {
		return (a: DateTime, b: DateTime): number => {
			const dateA = new Date(`${a.date}T${a.time}`);
			const dateB = new Date(`${b.date}T${b.time}`);

			return order === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
		};
	}
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

type WithName<M extends BaseMatch> = M & { name: string; player1Name: string; player2Name: string };

export interface GroupMatch extends WithName<BaseMatch> {
	type: "group";
	groupId: string;
}
export namespace GroupMatch {
	export function isInstance(match: BaseMatch): match is GroupMatch {
		return match.type === "group";
	}
}
export interface KnockoutMatch extends WithName<BaseMatch> {
	type: "quarter-final" | "semi-final" | "final";
}
export namespace KnockoutMatch {
	export function isInstance(match: BaseMatch): match is KnockoutMatch {
		return !GroupMatch.isInstance(match);
	}
}
export type Match = GroupMatch | KnockoutMatch;

export interface Group {
	id: string;
	name: string;
	players: string[];
	matches: string[];
}

export interface GroupSummary extends Group {
	completedMatches: number;
	status: "active" | "completed" | "upcoming";
	leader: { name: string; points: number } | null;
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
