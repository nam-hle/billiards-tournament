import { ClientBillMember } from "@/schemas";
import { type SupabaseInstance } from "@/services/supabase/server";
import { BillsControllers, NotificationsControllers } from "@/controllers";

export namespace BillMembersControllers {
	export interface CreatePayload {
		readonly billId: string;
		readonly userId: string;
		readonly amount: number;
		readonly billDisplayId: string;
	}
	export async function createMany(supabase: SupabaseInstance, triggerId: string, payloads: CreatePayload[]) {
		await supabase
			.from("bill_debtors")
			.insert(payloads.map(({ billDisplayId, billId: bill_id, userId: user_id, ...payload }) => ({ ...payload, bill_id, user_id })))
			.throwOnError();

		await NotificationsControllers.createManyBillCreated(
			supabase,
			payloads.map((payload) => ({ ...payload, triggerId, role: "Debtor" }))
		);
	}

	export interface UpdateMemberPayload {
		readonly amount: number;
		readonly userId: string;
	}

	export interface UpdatePayload {
		readonly billDisplayId: string;
		readonly nextDebtors: UpdateMemberPayload[];
	}
	export async function updateMany(supabase: SupabaseInstance, triggerId: string, payload: UpdatePayload) {
		const { nextDebtors, billDisplayId } = payload;

		const bill = await BillsControllers.getByDisplayId(supabase, { userId: triggerId, displayId: billDisplayId });
		const currentDebtors = bill.debtors.map((debtor) => ({ amount: debtor.amount, userId: debtor.user.userId }));

		const comparisonResult = diffMembers(currentDebtors, nextDebtors);

		await updateManyAmount(
			supabase,
			triggerId,
			comparisonResult.updatedDebtors.map((update) => ({ billId: bill.id, billDisplayId: billDisplayId, ...update }))
		);

		await createMany(
			supabase,
			triggerId,
			comparisonResult.addedDebtors.map((add) => ({ billId: bill.id, billDisplayId: billDisplayId, ...add }))
		);

		await deleteMany(
			supabase,
			triggerId,
			comparisonResult.removedDebtors.map(({ amount, ...remove }) => ({ billId: bill.id, billDisplayId: billDisplayId, ...remove }))
		);
	}

	function diffMembers(currentBillMembers: UpdateMemberPayload[], payloadBillMembers: UpdateMemberPayload[]) {
		const addedDebtors = payloadBillMembers.filter((payloadBillMember) => {
			return !currentBillMembers.some((currentBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember));
		});

		const removedDebtors = currentBillMembers.filter((currentBillMember) => {
			return !payloadBillMembers.some((payloadBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember));
		});

		const updatedDebtors = payloadBillMembers.flatMap((payloadBillMember) => {
			const member = currentBillMembers.find(
				(currentBillMember) => ClientBillMember.isEqual(currentBillMember, payloadBillMember) && currentBillMember.amount !== payloadBillMember.amount
			);

			if (!member) {
				return [];
			}

			return { ...payloadBillMember, previousAmount: member.amount };
		});

		return { addedDebtors, removedDebtors, updatedDebtors };
	}

	export interface UpdateAmountPayload {
		readonly billId: string;
		readonly amount: number;
		readonly userId: string;
		readonly billDisplayId: string;
		readonly previousAmount: number;
	}
	export async function updateManyAmount(supabase: SupabaseInstance, triggerId: string, payloads: UpdateAmountPayload[]) {
		const updatePromises = payloads.map(({ amount, userId, billId }) =>
			supabase.from("bill_debtors").update({ amount }).match({ user_id: userId, bill_id: billId }).select().throwOnError()
		);

		const results = await Promise.all(updatePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error updating bill members");
		}

		await NotificationsControllers.createManyBillUpdated(
			supabase,
			payloads.map(({ previousAmount, amount: currentAmount, ...payload }) => {
				return { ...payload, triggerId, currentAmount, previousAmount };
			})
		);
	}

	export interface DeletedPayload {
		readonly billId: string;
		readonly userId: string;
		readonly billDisplayId: string;
	}

	export async function deleteMany(supabase: SupabaseInstance, triggerId: string, payloads: DeletedPayload[]) {
		const deletePromises = payloads.map(({ userId: user_id, billId: bill_id }) =>
			supabase.from("bill_debtors").delete().match({ bill_id, user_id }).throwOnError()
		);

		const results = await Promise.all(deletePromises);

		const errors = results.filter((result) => result.error);

		if (errors.length > 0) {
			throw new Error("Error deleting bill members");
		}

		await NotificationsControllers.createManyBillDeleted(
			supabase,
			payloads.map((payload) => ({ ...payload, triggerId, role: "Debtor" }))
		);
	}
}
