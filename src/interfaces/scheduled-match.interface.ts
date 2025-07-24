import { type Match, type BaseMatch } from "@/interfaces/match.interface";

export type WithScheduled<M extends BaseMatch> = M & Required<Pick<M, "scheduledAt">>;
export type ScheduledMatch = WithScheduled<Match>;
export namespace ScheduledMatch {
	export function isInstance<M extends BaseMatch>(match: M): match is WithScheduled<M> {
		return match.scheduledAt !== undefined;
	}
}
