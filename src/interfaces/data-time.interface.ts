import { parse } from "date-fns";

export interface DateTime {
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

	export function toDate(dateTime: DateTime): Date {
		return parse(`${dateTime.date} ${dateTime.time}`, "yyyy-MM-dd HH:mm", new Date());
	}
}
