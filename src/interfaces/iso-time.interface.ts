import { format } from "date-fns";

export type ISOTime = string;

export namespace ISOTime {
	export function createComparator(order: "asc" | "desc") {
		return (a: ISOTime, b: ISOTime): number => {
			const dateA = new Date(a);
			const dateB = new Date(b);

			return order === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
		};
	}

	export function getDate(isoTime: ISOTime): string {
		return format(new Date(isoTime), "yyyy-MM-dd");
	}

	export const formatDate = (isoTime: ISOTime | undefined, options?: Intl.DateTimeFormatOptions & { fallback?: string }) => {
		if (!isoTime) {
			return options?.fallback || "TBD";
		}

		return new Date(isoTime).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			weekday: "short",
			...options
		});
	};

	export const formatTime = (isoTime: ISOTime | undefined, options?: { fallback?: string }) => {
		if (!isoTime) {
			return options?.fallback || "TBD";
		}

		return new Date(isoTime).toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
	};

	export const formatDateTime = (isoTime: ISOTime | undefined, options?: { fallback?: string }) => {
		if (!isoTime) {
			return options?.fallback || "TBD";
		}

		return `${formatDate(isoTime)} at ${formatTime(isoTime)}`;
	};
}
