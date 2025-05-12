import { format } from "date-fns";

import { SERVER_DATE_FORMAT } from "@/utils";

export const DEFAULT_PASSWORD = "123456";

export type UserName = keyof typeof USERNAMES;
export type FullName = (typeof FULL_NAMES)[UserName];
export type GroupName = "Gryffindor" | "Hogwarts";

export const VND = "₫";

export interface BillMember {
	name: FullName;
	amount: string;
}

export const FULL_NAMES = {
	ron: "Ron Weasley",
	harry: "Harry Potter",
	snape: "Severus Snape",
	hermione: "Hermione Granger",
	dumbledore: "Albus Dumbledore"
} as const;

export const USERNAMES = {
	ron: "ron",
	harry: "harry",
	snape: "snape",
	hermione: "hermione",
	dumbledore: "dumbledore"
} as const;

export function getCurrentDate() {
	return format(new Date(), SERVER_DATE_FORMAT);
}

export const BANKS = {
	BIDV: { id: "970418", name: "BIDV" },
	Vietinbank: { id: "970415", name: "Vietinbank" },
	Vietcombank: { id: "970436", name: "Vietcombank" }
};
