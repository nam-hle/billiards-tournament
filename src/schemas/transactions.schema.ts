import { z } from "zod";

import type { Database } from "@/database.types";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { UserMetaSchema } from "@/schemas/user.schema";
import { GroupSchema, DataListResponseSchema } from "@/schemas";

export const TransactionStatusEnumSchema = z.enum([
	"Waiting",
	"Confirmed",
	"Declined"
] as const satisfies Database["public"]["Enums"]["TransactionStatus"][]);
export type TransactionStatus = z.infer<typeof TransactionStatusEnumSchema>;

export const TransactionSchema = z
	.object({
		amount: z.number(),
		group: GroupSchema,
		issuedAt: z.string(),
		displayId: z.string(),
		createdAt: z.string(),
		sender: UserMetaSchema,
		receiver: UserMetaSchema,
		status: TransactionStatusEnumSchema,
		bankAccountId: z.string().nullable()
	})
	.strict();
export type Transaction = z.infer<typeof TransactionSchema>;

export const TransactionNotificationSchema = TransactionSchema.omit({ group: true, bankAccountId: true });

export const TransactionCreatePayloadSchema = z.object({
	amount: z.number(),
	issuedAt: z.string(),
	receiverId: z.string().min(1, "Receiver is required"),
	bankAccountId: z.string().min(1, "Bank account is required")
});
export const TransactionUpdatePayloadSchema = z.object({
	displayId: z.string(),
	status: TransactionStatusEnumSchema.exclude(["Waiting"])
});

export const TransactionSuggestionSchema = z.object({
	suggestion: z.object({ amount: z.number(), receiverId: z.string(), bankAccountId: z.string() }).optional()
});
export type TransactionSuggestion = z.infer<typeof TransactionSuggestionSchema>;

export const TransactionQRCreatePayloadSchema = z
	.object({
		amount: z.number(),
		receiverId: z.string(),
		bankAccountId: z.string()
	})
	.strict();
export type TransactionQRCreatePayload = z.infer<typeof TransactionQRCreatePayloadSchema>;

export const TransactionGetManyPayloadSchema = z.object({
	senderId: z.string().optional(),
	receiverId: z.string().optional(),
	page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
});
export const TransactionGetManyResponseSchema = DataListResponseSchema(TransactionSchema);
