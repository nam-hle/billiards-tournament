import { z } from "zod";

import { API } from "@/api";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants";
import { BillsControllers, BillMembersControllers } from "@/controllers";
import { router, privateProcedure, withSelectedGroup } from "@/services/trpc/server";

export const billsRouter = router({
	get: privateProcedure
		.input(z.object({ displayId: z.string() }))
		.query(({ input, ctx: { user, supabase } }) => BillsControllers.getByDisplayId(supabase, { ...input, userId: user.id })),
	update: privateProcedure
		.input(API.Bills.Update.PayloadSchema)
		.output(z.object({ commitId: z.string() }).strict())
		.mutation(async ({ input, ctx: { supabase, user: updater } }) => {
			const { debtors, commitId, issuedAt, creditor, displayId, description, receiptFile } = input;

			// Members need to be updated first
			await BillMembersControllers.updateMany(supabase, updater.id, { nextDebtors: debtors, billDisplayId: displayId });

			return BillsControllers.updateByDisplayId(supabase, displayId, {
				issuedAt,
				commitId,
				receiptFile,
				description,
				updaterId: updater.id,
				creditorId: creditor.userId,
				totalAmount: creditor.amount
			});
		}),
	getMany: privateProcedure
		.use(withSelectedGroup)
		.input(API.Bills.List.PayloadSchema)
		.output(API.Bills.List.ResponseSchema)
		.query(async ({ ctx, input }) => {
			const { user, supabase } = ctx;
			const currentUserId = user.id;
			const { page, debtor, creator, creditor, ...rest } = input;

			const resolvedSearchParams: BillsControllers.GetManyByMemberIdPayload = {
				...rest,
				member: currentUserId,
				limit: DEFAULT_PAGE_SIZE,
				page: page ?? DEFAULT_PAGE_NUMBER,
				debtor: debtor === "me" ? currentUserId : undefined,
				creator: creator === "me" ? currentUserId : undefined,
				creditor: creditor === "me" ? currentUserId : undefined
			};

			return BillsControllers.getManyByMemberId(supabase, user, resolvedSearchParams);
		}),
	create: privateProcedure
		.use(withSelectedGroup)
		.input(API.Bills.UpsertBillSchema)
		.output(z.object({ displayId: z.string() }))
		.mutation(async ({ input, ctx: { supabase, user: creator } }) => {
			const { debtors, issuedAt, creditor, description, receiptFile } = input;

			// Step 1: Insert bill
			const bill = await BillsControllers.create(supabase, {
				issuedAt,
				description,
				receiptFile,
				creatorId: creator.id,
				groupId: creator.group.id,
				creditorId: creditor.userId,
				totalAmount: creditor.amount
			});

			const billMembers = debtors.map(({ userId, amount }) => {
				return { userId, amount, billId: bill.id, role: "Debtor" as const, billDisplayId: bill.displayId };
			});

			await BillMembersControllers.createMany(supabase, creator.id, billMembers);

			return { displayId: bill.displayId };
		})
});
