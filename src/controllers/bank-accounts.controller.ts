import { type z } from "zod";
import { TRPCError } from "@trpc/server";

import { type SupabaseInstance } from "@/services/supabase/server";
import { type BankAccount, BankAccountTypeEnumSchema, type BankAccountCreatePayload, type BankAccountStatusEnumSchema } from "@/schemas";

export namespace BankAccountsController {
	const BANK_ACCOUNT_SELECT = `
    providerNumber:provider_number,
    accountNumber:account_number,
    accountHolder:account_holder,
    isDefault:is_default,
    type,
    status,
    
    id,
    createdAt:created_at,
    userId:user_id
  `;

	export async function updateAccountStatus(
		supabase: SupabaseInstance,
		userId: string,
		payload: { accountId: string; status: z.infer<typeof BankAccountStatusEnumSchema> }
	) {
		const account = await getById(supabase, userId, payload.accountId);

		if (!account) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
		}

		await supabase.from("bank_accounts").update({ status: payload.status }).eq("id", payload.accountId);
	}

	export async function setDefaultAccount(supabase: SupabaseInstance, userId: string, accountId: string) {
		const account = await getById(supabase, userId, accountId);

		if (!account) {
			throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
		}

		await supabase.from("bank_accounts").update({ is_default: false }).eq("user_id", userId);

		await supabase.from("bank_accounts").update({ is_default: true }).eq("user_id", userId).eq("id", accountId).throwOnError();
	}

	export async function create(supabase: SupabaseInstance, userId: string, bankAccount: BankAccountCreatePayload): Promise<{ id: string }> {
		if (bankAccount.isDefault) {
			await supabase.from("bank_accounts").update({ is_default: false }).eq("user_id", userId);
		}

		const { data } = await supabase
			.from("bank_accounts")
			.insert({
				user_id: userId,
				is_default: bankAccount.isDefault,
				type: BankAccountTypeEnumSchema.enum.Bank,
				account_holder: bankAccount.accountHolder,
				account_number: bankAccount.accountNumber,
				provider_number: bankAccount.providerNumber
			})
			.select("id")
			.single()
			.throwOnError();

		if (!data) {
			throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create bank account" });
		}

		return data;
	}

	export async function getById(supabase: SupabaseInstance, userId: string, accountId: string): Promise<BankAccount | null> {
		const { data } = await supabase
			.from("bank_accounts")
			.select(BANK_ACCOUNT_SELECT)
			.eq("id", accountId)
			.eq("user_id", userId)
			.single()
			.throwOnError();

		return data;
	}

	export async function getSuggestedAccountByUserId(supabase: SupabaseInstance, userId: string): Promise<BankAccount | undefined> {
		const defaultAccount = await getDefaultAccountByUserId(supabase, userId);

		if (defaultAccount) {
			return defaultAccount;
		}

		const accounts = await getByUserId(supabase, userId);

		return accounts[0];
	}

	export async function getDefaultAccountByUserId(supabase: SupabaseInstance, userId: string): Promise<BankAccount | undefined> {
		const { data, error } = await supabase.from("bank_accounts").select(BANK_ACCOUNT_SELECT).eq("user_id", userId);

		if (error) {
			throw error;
		}

		return data.find((account) => account.isDefault);
	}

	export async function getByUserId(supabase: SupabaseInstance, userId: string): Promise<BankAccount[]> {
		const { data, error } = await supabase
			.from("bank_accounts")
			.select(BANK_ACCOUNT_SELECT)
			.eq("user_id", userId)
			.order("created_at", { ascending: true });

		if (error) {
			throw error;
		}

		return data ?? [];
	}
}
