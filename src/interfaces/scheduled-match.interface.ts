import { ISOTime } from "@/interfaces/iso-time.interface";
import { type Match, type BaseMatch } from "@/interfaces/match.interface";

export type WithScheduled<M extends BaseMatch> = M & {
	scheduledAt: ISOTime;
};
export type ScheduledMatch = WithScheduled<Match>;
export namespace ScheduledMatch {
	export function isInstance<M extends BaseMatch>(match: M): match is WithScheduled<M> {
		return match.scheduledAt !== null;
	}

	export const ascendingComparator = (a: ScheduledMatch, b: ScheduledMatch): number => {
		return ISOTime.createComparator("asc")(a.scheduledAt, b.scheduledAt);
	};

	export const descendingComparator = (a: ScheduledMatch, b: ScheduledMatch): number => {
		return ISOTime.createComparator("desc")(a.scheduledAt, b.scheduledAt);
	};

	export const nullableAscendingComparator = (a: Match, b: Match) => {
		if (ScheduledMatch.isInstance(a) && ScheduledMatch.isInstance(b)) {
			return ascendingComparator(a, b);
		}

		if (ScheduledMatch.isInstance(a)) {
			return -1;
		}

		if (ScheduledMatch.isInstance(b)) {
			return 1;
		}

		return 0;
	};
}
