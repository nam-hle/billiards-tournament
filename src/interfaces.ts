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
	player1Id?: string;
	player2Id?: string;
}

export type WithDefinedPlayers<M extends Match = Match> = M &
	Required<Pick<M, "player1Id" | "player2Id">> & { player1Name: string; player2Name: string };
export namespace DefinedPlayersMatch {
	export function isInstance<M extends Match>(match: M): match is WithDefinedPlayers<M> {
		return (
			match.player1Id !== undefined &&
			match.player2Id !== undefined &&
			"player1Name" in match &&
			match.player1Name !== undefined &&
			"player2Name" in match &&
			match.player2Name !== undefined
		);
	}
}

export interface GroupMatch extends BaseMatch {
	name: string;
	type: "group";
	groupId: string;
}
export namespace GroupMatch {
	export function isInstance(match: BaseMatch): match is GroupMatch {
		return match.type === "group";
	}
}
export interface KnockoutMatch extends BaseMatch {
	name: string;
	type: "quarter-final" | "semi-final" | "final";
}
export namespace KnockoutMatch {
	export function isInstance(match: BaseMatch): match is KnockoutMatch {
		return !GroupMatch.isInstance(match);
	}
}
export type Match = GroupMatch | KnockoutMatch;
// TODO: "waiting"??
export type MatchStatus = "scheduling" | "scheduled" | "waiting" | "in-progress" | "completed";
export namespace Match {
	export function getStatus(match: Match) {
		if (DefinedPlayersMatch.isInstance(match)) {
			if (CompletedMatch.isInstance(match)) {
				return "completed";
			}

			if (match.score1 !== undefined && match.score2 !== undefined) {
				return "in-progress";
			}

			if (ScheduledMatch.isInstance(match)) {
				return "scheduled";
			}

			return "scheduling";
		}

		if (ScheduledMatch.isInstance(match)) {
			return "scheduled";
		}

		return "waiting";
	}

	export function getRaceScore(match: BaseMatch): number {
		if (GroupMatch.isInstance(match)) {
			return 5;
		}

		if (KnockoutMatch.isInstance(match)) {
			switch (match.type) {
				case "quarter-final":
					return 7;
				case "semi-final":
					return 9;
				case "final":
					return 11;
				default:
					throw new Error(`Unknown knockout match type: ${match.type}`);
			}
		}

		throw new Error(`Unknown match type: ${match.type}`);
	}
}

export type WithCompleteness<M extends WithDefinedPlayers> = M & Required<Pick<M, "scheduledAt" | "score1" | "score2">>;

export type CompletedMatch = WithScheduled<WithCompleteness<WithDefinedPlayers>>;
export namespace CompletedMatch {
	export function isInstance<M extends WithDefinedPlayers>(match: M): match is WithCompleteness<M> {
		return match.score1 !== undefined && match.score2 !== undefined && [match.score1, match.score2].includes(Match.getRaceScore(match));
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

	export function getLoserRacksWon(match: CompletedMatch): number {
		if (match.score1 > match.score2) {
			return match.score2;
		}

		if (match.score2 > match.score1) {
			return match.score1;
		}

		throw new Error("Match is a draw, cannot determine loser racks won");
	}

	export function getWinnerRacksWon(match: CompletedMatch): number {
		if (match.score1 > match.score2) {
			return match.score1;
		}

		if (match.score2 > match.score1) {
			return match.score2;
		}

		throw new Error("Match is a draw, cannot determine loser racks won");
	}
}

export type WithScheduled<M extends BaseMatch> = M & Required<Pick<M, "scheduledAt">>;
export type ScheduledMatch = WithScheduled<Match>;
export namespace ScheduledMatch {
	export function isInstance<M extends BaseMatch>(match: M): match is WithScheduled<M> {
		return match.scheduledAt !== undefined;
	}
}
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
