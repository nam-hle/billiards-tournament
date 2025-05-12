import { z } from "zod";

import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { ClientBillSchema, DataListResponseSchema } from "@/schemas";

export namespace API {
	export namespace Bills {
		export const UpsertBillMemberSchema = z.object({ userId: z.string(), amount: z.number() });

		export const UpsertBillSchema = z.object({
			// TODO: Validate
			issuedAt: z.string(),
			creditor: UpsertBillMemberSchema,
			receiptFile: z.string().nullable(),
			debtors: z.array(UpsertBillMemberSchema),
			description: z.string().max(50, "Description is too long").min(1, "Description is required")
		});

		export namespace Update {
			export const PayloadSchema = UpsertBillSchema.extend({ commitId: z.string(), displayId: z.string() });
		}

		export namespace List {
			export const PayloadSchema = z.object({
				q: z.string().optional(),
				debtor: z.literal("me").optional(),
				creator: z.literal("me").optional(),
				creditor: z.literal("me").optional(),
				since: z.enum(["7d", "30d"]).optional(),
				page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE_NUMBER)
			});
			export type Payload = z.infer<typeof PayloadSchema>;

			export const ResponseSchema = DataListResponseSchema(ClientBillSchema);
			export type Response = z.infer<typeof ResponseSchema>;
		}
	}
}
