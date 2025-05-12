import { z } from "zod";

import { TransactionsControllers } from "@/controllers";
import { router, privateProcedure, withSelectedGroup } from "@/services/trpc/server";
import {
	TransactionSchema,
	TransactionSuggestionSchema,
	TransactionCreatePayloadSchema,
	TransactionUpdatePayloadSchema,
	TransactionGetManyPayloadSchema,
	TransactionGetManyResponseSchema,
	TransactionQRCreatePayloadSchema
} from "@/schemas";

export const transactionsRouter = router({
	get: privateProcedure
		.input(z.object({ displayId: z.string() }))
		.output(TransactionSchema)
		.query(({ input, ctx: { user, supabase } }) => TransactionsControllers.getByDisplayId(supabase, { ...input, userId: user.id })),
	getMany: privateProcedure
		.use(withSelectedGroup)
		.input(TransactionGetManyPayloadSchema)
		.output(TransactionGetManyResponseSchema)
		.query(({ input, ctx: { user, supabase } }) => TransactionsControllers.getMany(supabase, user, input)),

	update: privateProcedure
		.use(withSelectedGroup)
		.input(TransactionUpdatePayloadSchema)
		.mutation(({ input, ctx: { supabase } }) => TransactionsControllers.update(supabase, input)),
	suggest: privateProcedure
		.use(withSelectedGroup)
		.output(TransactionSuggestionSchema)
		.mutation(({ ctx: { user, supabase } }) => TransactionsControllers.suggest(supabase, user.id, user.group.id)),
	generateQR: privateProcedure
		.use(withSelectedGroup)
		.input(TransactionQRCreatePayloadSchema)
		.output(z.object({ url: z.string() }))
		.mutation(({ input, ctx: { supabase } }) => TransactionsControllers.generateQR(supabase, input)),
	create: privateProcedure
		.use(withSelectedGroup)
		.input(TransactionCreatePayloadSchema)
		.output(z.object({ displayId: z.string() }))
		.mutation(async ({ input, ctx: { supabase, user: sender } }) => {
			const { amount, issuedAt, receiverId, bankAccountId } = input;

			const displayId = await TransactionsControllers.create(supabase, {
				amount,
				issuedAt,
				receiverId,
				bankAccountId,
				senderId: sender.id,
				groupId: sender.group.id
			});

			return { displayId };
		})
});
