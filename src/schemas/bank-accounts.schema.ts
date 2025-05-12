import { z } from "zod";

import type { Database } from "@/database.types";

export const BankAccountStatusEnumSchema = z.enum(["Active", "Inactive"] as const satisfies Database["public"]["Enums"]["BankAccountStatus"][]);
export const BankAccountTypeEnumSchema = z.enum(["Bank", "Wallet"] as const satisfies Database["public"]["Enums"]["BankAccountType"][]);

export const BankAccountCreatePayloadSchema = z
	.object({
		providerNumber: z.string().regex(/^\d{6}$/, "Provider number must be 6 digits"),
		accountNumber: z
			.string()
			.min(6, "Account number must be at least 6 digits")
			.max(19, "Account number must be at most 19 digits")
			.regex(/^\d+$/, "Account number must contain only digits"),
		accountHolder: z
			.string()
			.min(5, "Account holder name must be at least 5 characters")
			.max(50, "Account holder name must be at most 50 characters")
			.regex(/^[A-Z ]+$/, "Account holder name must be uppercase and contain only letters and spaces"),

		type: BankAccountTypeEnumSchema,
		status: BankAccountStatusEnumSchema,
		isDefault: z.boolean().optional().default(false)
	})
	.strict();
export type BankAccountCreatePayload = z.infer<typeof BankAccountCreatePayloadSchema>;

export const BankAccountSchema = BankAccountCreatePayloadSchema.extend({
	id: z.string(),
	userId: z.string(),
	createdAt: z.string()
}).strict();

export type BankAccount = z.infer<typeof BankAccountSchema>;
