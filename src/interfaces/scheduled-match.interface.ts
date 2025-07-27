import { type Match } from "@/interfaces/match.interface";
import { ISOTime } from "@/interfaces/iso-time.interface";

export type WithScheduled<M extends Match> = M & Required<Pick<M, "scheduledAt">>;
export type ScheduledMatch = WithScheduled<Match>;
export namespace ScheduledMatch {
	export function isInstance<M extends Match>(match: M): match is WithScheduled<M> {
		return match.scheduledAt !== undefined;
	}

	export const ascendingComparator = (a: ScheduledMatch, b: ScheduledMatch): number => {
		return ISOTime.createComparator("asc")(a.scheduledAt, b.scheduledAt);
	};

	export const descendingComparator = (a: ScheduledMatch, b: ScheduledMatch): number => {
		return ISOTime.createComparator("desc")(a.scheduledAt, b.scheduledAt);
	};
}
