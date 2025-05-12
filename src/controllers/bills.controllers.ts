import { TRPCError } from "@trpc/server";

import { type API } from "@/api";
import { type ClientBill } from "@/schemas";
import { BillIdGenerator, CommitIdGenerator } from "@/utils";
import { pickUniqueId, ensureAuthorized } from "@/controllers/utils";
import { type MemberContext, type SupabaseInstance } from "@/services/supabase/server";
import { GroupController, UserControllers, NotificationsControllers } from "@/controllers";

export namespace BillsControllers {
	const BILLS_SELECT = `
    id,
    commitId:commit_id,
    displayId:display_id,
    group:groups!group_id (${GroupController.GROUP_SELECT}),
    
    creator:profiles!creator_id   (${UserControllers.USER_META_SELECT}),
    createdAt:created_at,
    
    updater:profiles!updater_id   (${UserControllers.USER_META_BASE_SELECT}),
    updatedAt:updated_at,
    
    description,
    issuedAt:issued_at,
    receiptFile:receipt_file,
    totalAmount:total_amount,
    creditor:profiles!creditor_id (${UserControllers.USER_META_SELECT}),
    billDebtors:bill_debtors (user:user_id (${UserControllers.USER_META_SELECT}), amount, role)
  `;

	export async function create(
		supabase: SupabaseInstance,
		payload: {
			groupId: string;
			issuedAt: string;
			creatorId: string;
			creditorId: string;
			totalAmount: number;
			description: string;
			receiptFile: string | null;
		}
	) {
		const {
			description,
			groupId: group_id,
			issuedAt: issued_at,
			creatorId: creator_id,
			creditorId: creditor_id,
			receiptFile: receipt_file,
			totalAmount: total_amount
		} = payload;
		const displayId = await pickUniqueId(supabase, "bills", "display_id", BillIdGenerator);

		const { data } = await supabase
			.from("bills")
			.insert({
				group_id,
				issued_at,
				creator_id,
				description,
				creditor_id,
				receipt_file,
				total_amount,
				display_id: displayId,
				commit_id: CommitIdGenerator()
			})
			.select("id, displayId:display_id")
			.single()
			.throwOnError();

		if (!data) {
			throw new Error("Error creating bill");
		}

		await NotificationsControllers.createManyBillCreated(supabase, [
			{ role: "Creditor", userId: creditor_id, amount: total_amount, triggerId: creator_id, billDisplayId: displayId }
		]);

		return data;
	}

	export interface GetManyByMemberIdPayload extends Omit<API.Bills.List.Payload, "debtor" | "creator" | "creditor"> {
		readonly limit: number;
		readonly member: string;
		readonly debtor?: string;
		readonly creator?: string;
		readonly creditor?: string;
	}

	export async function getManyByMemberId(
		supabase: SupabaseInstance,
		memberContext: MemberContext,
		payload: GetManyByMemberIdPayload
	): Promise<API.Bills.List.Response> {
		const { page, limit, since, debtor, member, creator, creditor, q: textSearch } = payload;

		let sinceDate: string | null = null;

		if (since !== undefined && /^\d+d$/.test(since)) {
			const days = parseInt(since.replace("d", ""), 10);

			if (!isNaN(days)) {
				sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
			}
		}

		const { data } = await supabase
			.rpc("get_filtered_bills", {
				page_size: limit,
				page_number: page,
				text_search: textSearch ?? undefined,
				since_timestamp: sinceDate ?? undefined,

				member,
				debtor,
				creator,
				creditor,
				group: memberContext.group.id
			})
			.throwOnError();

		if (!data?.length) {
			return { data: [], fullSize: 0 };
		}

		const { data: bills } = await supabase
			.from("bills")
			.select(BILLS_SELECT)
			.in("id", data?.map((e) => e.id) ?? [])
			.order("created_at", { ascending: false })
			.throwOnError();

		return { fullSize: data[0].total_count, data: bills?.map(toClientBill) ?? [] };
	}

	function toClientBill(bill: BillSelectResult): ClientBill {
		const { creator, updater, creditor, updatedAt, createdAt, totalAmount, billDebtors, ...rest } = bill;

		const debtors = billDebtors.filter((bm) => bm.role === "Debtor");

		return {
			...rest,
			debtors,
			creator: { ...creator, timestamp: createdAt },
			creditor: { user: creditor, amount: totalAmount, role: "Creditor" as const },
			updater: updater && updatedAt ? { ...updater, timestamp: updatedAt } : undefined
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function __get(supabase: SupabaseInstance) {
		const { data } = await supabase.from("bills").select(BILLS_SELECT).single();

		if (!data) {
			throw new Error("Bill not found");
		}

		return data;
	}

	type BillSelectResult = Awaited<ReturnType<typeof __get>>;

	export async function getByDisplayId(supabase: SupabaseInstance, payload: { userId: string; displayId: string }): Promise<ClientBill> {
		const { data: bill } = await supabase.from("bills").select(BILLS_SELECT).eq("display_id", payload.displayId).single();

		if (!bill) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
		}

		// TODO: Remove this after implementing RLS
		await ensureAuthorized(supabase, { userId: payload.userId, groupId: bill.group.id });

		return toClientBill(bill);
	}

	export async function updateByDisplayId(
		supabase: SupabaseInstance,
		displayId: string,
		payload: {
			commitId: string;
			issuedAt: string;
			updaterId: string;
			creditorId: string;
			totalAmount: number;
			description: string;
			receiptFile: string | null;
		}
	): Promise<{ commitId: string }> {
		const {
			commitId,
			description,
			issuedAt: issued_at,
			updaterId: updater_id,
			creditorId: creditor_id,
			totalAmount: total_amount,
			receiptFile: receipt_file
		} = payload;

		const { data: currentBill } = await supabase.from("bills").select(BILLS_SELECT).eq("display_id", displayId).single().throwOnError();

		if (!currentBill) {
			throw new Error("Bill not found");
		}

		if (currentBill.commitId !== commitId) {
			throw new TRPCError({ code: "CONFLICT", message: "Bill has been updated by another user" });
		}

		await createCreditorNotifications(supabase, {
			triggerId: updater_id,
			displayId: currentBill.displayId,
			nextCreditor: { userId: creditor_id, amount: total_amount },
			currentCreditor: { amount: currentBill.totalAmount, userId: currentBill.creditor.userId }
		});

		const newCommitId = CommitIdGenerator();

		await supabase
			.from("bills")
			.update({ issued_at, updater_id, creditor_id, description, total_amount, receipt_file, commit_id: newCommitId })
			.eq("display_id", displayId)
			.select()
			.throwOnError();

		return { commitId: newCommitId };
	}

	interface Creditor {
		readonly userId: string;
		readonly amount: number;
	}
	async function createCreditorNotifications(
		supabase: SupabaseInstance,
		payload: { triggerId: string; displayId: string; nextCreditor: Creditor; currentCreditor: Creditor }
	) {
		const { triggerId, displayId, nextCreditor, currentCreditor } = payload;

		if (currentCreditor.userId === nextCreditor.userId) {
			if (currentCreditor.amount === nextCreditor.amount) {
				return;
			}

			await NotificationsControllers.createManyBillUpdated(supabase, [
				{
					triggerId,
					billDisplayId: displayId,
					userId: currentCreditor.userId,
					currentAmount: nextCreditor.amount,
					previousAmount: currentCreditor.amount
				}
			]);

			return;
		}

		await NotificationsControllers.createManyBillDeleted(supabase, [
			{ triggerId, role: "Creditor", billDisplayId: displayId, userId: currentCreditor.userId }
		]);
		await NotificationsControllers.createManyBillCreated(supabase, [
			{ triggerId, role: "Creditor", billDisplayId: displayId, amount: nextCreditor.amount, userId: nextCreditor.userId }
		]);
	}
}
