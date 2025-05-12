import axios from "axios";
import { type z } from "zod";
import { TRPCError } from "@trpc/server";

import { Pagination } from "@/types";
import { Environments } from "@/environments";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { assert, TransactionIdGenerator } from "@/utils";
import { pickUniqueId, ensureAuthorized } from "@/controllers/utils";
import { type MemberContext, type SupabaseInstance } from "@/services/supabase/server";
import { GroupController, UserControllers, BankAccountsController, NotificationsControllers } from "@/controllers";
import {
	type Transaction,
	type TransactionSuggestion,
	type TransactionQRCreatePayload,
	type TransactionUpdatePayloadSchema,
	type TransactionGetManyResponseSchema
} from "@/schemas";

export namespace TransactionsControllers {
	const TRANSACTIONS_SELECT = `
    displayId:display_id,
    group:groups!group_id (${GroupController.GROUP_SELECT}),
    createdAt:created_at,
    issuedAt:issued_at,
    
    amount,
    status,
    sender:profiles!sender_id (${UserControllers.USER_META_SELECT}),
    bankAccountId:bank_account_id,
    receiver:profiles!receiver_id (${UserControllers.USER_META_SELECT})
  `;

	export async function create(
		supabase: SupabaseInstance,
		payload: { amount: number; groupId: string; issuedAt: string; senderId: string; receiverId: string; bankAccountId: string | undefined }
	) {
		const { groupId: group_id, issuedAt: issued_at, senderId: sender_id, receiverId: receiver_id, bankAccountId: bank_account_id, ...rest } = payload;
		const displayId = await pickUniqueId(supabase, "transactions", "display_id", TransactionIdGenerator);

		const { data } = await supabase
			.from("transactions")
			.insert({ ...rest, group_id, issued_at, sender_id, receiver_id, bank_account_id, display_id: displayId })
			.select("id, displayId:display_id")
			.single()
			.throwOnError();

		if (!data) {
			throw new Error("Error creating transaction");
		}

		await NotificationsControllers.createTransaction(supabase, {
			status: "Waiting",
			userId: receiver_id,
			triggerId: sender_id,
			transactionDisplayId: displayId
		});

		return displayId;
	}

	export async function generateQR(supabase: SupabaseInstance, payload: TransactionQRCreatePayload) {
		const account = await BankAccountsController.getById(supabase, payload.receiverId, payload.bankAccountId);

		if (!account) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
		}

		const vietQRPayload = {
			addInfo: "ck",
			format: "svg",
			template: "print",
			amount: payload.amount,
			acqId: account.providerNumber,
			accountNo: account.accountNumber,
			accountName: account.accountHolder
		};

		const { data } = await axios.post(Environments.PRIVATE.VIETQR.URL, vietQRPayload, {
			headers: {
				"x-api-key": Environments.PRIVATE.VIETQR.API_KEY,
				"x-client-id": Environments.PRIVATE.VIETQR.CLIENT_ID
			}
		});

		if (data.code === "00") {
			return { url: data.data.qrDataURL };
		}

		throw new Error(data.message);
	}

	export async function suggest(supabase: SupabaseInstance, senderId: string, groupId: string): Promise<TransactionSuggestion> {
		const { data: receivers } = await supabase
			.from("user_financial_summary")
			.select("*")
			.eq("group_id", groupId)
			.neq("user_id", senderId)
			.lt("balance", 0)
			.order("balance", { ascending: true })
			.throwOnError();

		for (const receiver of receivers ?? []) {
			assert(receiver.balance && receiver.user_id);

			const bankAccount = await BankAccountsController.getSuggestedAccountByUserId(supabase, receiver.user_id);

			if (!bankAccount) {
				continue;
			}

			const senderBalance = await UserControllers.reportUsingView(supabase, { groupId, userId: senderId });

			return {
				suggestion: {
					receiverId: receiver.user_id,
					bankAccountId: bankAccount.id,
					amount: Math.min(Math.abs(senderBalance.net), Math.abs(receiver.balance))
				}
			};
		}

		return { suggestion: undefined };
	}

	export async function getMany(
		supabase: SupabaseInstance,
		userContext: MemberContext,
		filters?: {
			page?: number;
			senderId?: string;
			receiverId?: string;
		}
	): Promise<z.infer<typeof TransactionGetManyResponseSchema>> {
		const finalQuery = supabase.from("transactions").select(TRANSACTIONS_SELECT, { count: "exact" }).eq("group_id", userContext.group.id);
		const { page, senderId, receiverId } = filters ?? {};

		if (senderId) {
			finalQuery.eq("sender_id", senderId);
		} else if (receiverId) {
			finalQuery.eq("receiver_id", receiverId);
		} else {
			finalQuery.or(`sender_id.eq.${userContext.id},receiver_id.eq.${userContext.id}`);
		}

		const {
			count,
			error,
			data: transactions
		} = await finalQuery
			.order("issued_at", { ascending: false })
			.range(...Pagination.toRange({ ...Pagination.getDefault(), pageNumber: page ?? DEFAULT_PAGE_NUMBER }));

		if (error) {
			throw error;
		}

		return { fullSize: count ?? 0, data: transactions ?? [] };
	}

	export async function update(supabase: SupabaseInstance, payload: z.infer<typeof TransactionUpdatePayloadSchema>) {
		const { status, displayId } = payload;
		const { data, error } = await supabase.from("transactions").update({ status }).eq("displayId", displayId).select(TRANSACTIONS_SELECT).single();

		if (error) {
			throw error;
		}

		if (status === "Confirmed") {
			await NotificationsControllers.createTransaction(supabase, {
				status,
				userId: data.sender.userId,
				triggerId: data.receiver.userId,
				transactionDisplayId: data.displayId
			});
		} else if (status === "Declined") {
			await NotificationsControllers.createTransaction(supabase, {
				status,
				userId: data.receiver.userId,
				triggerId: data.sender.userId,
				transactionDisplayId: data.displayId
			});
		} else {
			throw new Error("Invalid status");
		}
	}

	export async function getByDisplayId(supabase: SupabaseInstance, payload: { userId: string; displayId: string }): Promise<Transaction> {
		const { data } = await supabase.from("transactions").select(TRANSACTIONS_SELECT).eq("display_id", payload.displayId).single();

		if (!data) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found" });
		}

		// TODO: Remove this after implementing RLS
		await ensureAuthorized(supabase, { userId: payload.userId, groupId: data.group.id });

		return data;
	}
}
