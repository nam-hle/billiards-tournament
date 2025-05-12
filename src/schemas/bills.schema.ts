import { z } from "zod";

import type { Database } from "@/database.types";
import { GroupSchema, UserMetaSchema } from "@/schemas";

export const BillMemberRoleSchema = z.enum(["Creditor", "Debtor"] as const satisfies Database["public"]["Enums"]["BillMemberRole"][]);
export type BillMemberRole = z.infer<typeof BillMemberRoleSchema>;

const ClientBillMemberSchema = z.object({
	amount: z.number(),
	user: UserMetaSchema,
	role: BillMemberRoleSchema
});
export type ClientBillMember = z.infer<typeof ClientBillMemberSchema>;
export namespace ClientBillMember {
	export function isEqual(a: { userId: string }, b: { userId: string }) {
		return a.userId === b.userId;
	}
}

export const ClientBillSchema = z.object({
	id: z.string(),
	commitId: z.string(),
	displayId: z.string(),

	group: GroupSchema,
	issuedAt: z.string(),
	creditor: ClientBillMemberSchema,
	receiptFile: z.string().nullable(),
	debtors: z.array(ClientBillMemberSchema),
	description: z.string().max(50, "Description is too long").min(1, "Description is required"),
	creator: z.object({ userId: z.string(), timestamp: z.string(), fullName: z.string().nullable() }),
	updater: z.object({ userId: z.string(), timestamp: z.string(), fullName: z.string().nullable() }).optional()
});
export type ClientBill = z.infer<typeof ClientBillSchema>;
