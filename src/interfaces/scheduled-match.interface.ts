import { type Match } from "@/interfaces/match.interface";
import { DateTime } from "@/interfaces/data-time.interface";

export type WithScheduled<M extends Match> = M & Required<Pick<M, "scheduledAt">>;
export type ScheduledMatch = WithScheduled<Match>;
export namespace ScheduledMatch {
	export function isInstance<M extends Match>(match: M): match is WithScheduled<M> {
		return match.scheduledAt !== undefined;
	}

	export const ascendingComparator = (a: ScheduledMatch, b: ScheduledMatch): number => {
		return DateTime.createComparator("asc")(a.scheduledAt, b.scheduledAt);
	};

	export const descendingComparator = (a: ScheduledMatch, b: ScheduledMatch): number => {
		return DateTime.createComparator("desc")(a.scheduledAt, b.scheduledAt);
	};
}
