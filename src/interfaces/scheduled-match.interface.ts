import { type Match } from "@/interfaces/match.interface";

export type WithScheduled<M extends Match> = M & Required<Pick<M, "scheduledAt">>;
export type ScheduledMatch = WithScheduled<Match>;
export namespace ScheduledMatch {
	export function isInstance<M extends Match>(match: M): match is WithScheduled<M> {
		return match.scheduledAt !== undefined;
	}
}
