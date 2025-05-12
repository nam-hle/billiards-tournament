import { type z } from "zod";

import { assert } from "@/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { notificationEvents } from "@/services";
import { type Database } from "@/database.types";
import { UserControllers } from "@/controllers/user.controllers";
import { type SupabaseInstance } from "@/services/supabase/server";
import {
	type BillMemberRole,
	type NotificationType,
	type TransactionStatus,
	type ClientNotification,
	type TransactionWaitingNotification,
	type BillCreatedNotificationMetadata,
	type BillDeletedNotificationMetadata,
	type BillUpdatedNotificationMetadata,
	type InfiniteNotificationResponseSchema,
	type PaginatedNotificationResponseSchema
} from "@/schemas";

export namespace NotificationsControllers {
	const NOTIFICATIONS_SELECT = `
	id, 
	type,
	userId:user_id,
	createdAt:created_at,
	readStatus:read_status,
	metadata,
	trigger:profiles!trigger_id (${UserControllers.USER_META_BASE_SELECT}),
	
	transaction:transaction_display_id (
		displayId:display_id,
		amount,
		status,
		createdAt:created_at,
		issuedAt:issued_at,
		sender:profiles!sender_id (${UserControllers.USER_META_SELECT}),
    receiver:profiles!receiver_id (${UserControllers.USER_META_SELECT})
	),

	bill:bill_display_id (
		displayId:display_id, 
		description, 
		creator:profiles!creator_id (${UserControllers.USER_META_BASE_SELECT})
	)
	`;

	export async function getByPage(
		supabase: SupabaseInstance,
		userId: string,
		payload: { page: number }
	): Promise<z.infer<typeof PaginatedNotificationResponseSchema>> {
		const { page } = payload;
		const startIndex = (page - 1) * DEFAULT_PAGE_SIZE;
		const endIndex = startIndex + DEFAULT_PAGE_SIZE; // Query one more to check if there is a next page

		const query = supabase
			.from("notifications")
			.select(NOTIFICATIONS_SELECT)
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.range(startIndex, endIndex);

		const { data: notifications } = await query.throwOnError();
		assert(notifications !== null, "Notifications should not be null");

		return {
			hasNextPage: notifications.length === endIndex - startIndex + 1,
			notifications: notifications.slice(0, DEFAULT_PAGE_SIZE).map(toClientNotification)
		};
	}

	export async function getByCursor(
		supabase: SupabaseInstance,
		userId: string,
		payload: { cursor?: string | null }
	): Promise<z.infer<typeof InfiniteNotificationResponseSchema>> {
		const { cursor } = payload;
		let query = supabase
			.from("notifications")
			.select(NOTIFICATIONS_SELECT)
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.limit(DEFAULT_PAGE_SIZE);

		if (cursor) {
			query = query.lt("created_at", cursor);
		}

		const { data: notifications } = await query.throwOnError();
		assert(notifications !== null, "Notifications should not be null");

		const nextCursor = notifications.length === DEFAULT_PAGE_SIZE ? notifications[notifications.length - 1].createdAt : null;

		return {
			nextCursor,
			notifications: notifications.slice(0, DEFAULT_PAGE_SIZE).map(toClientNotification)
		};
	}

	type NotificationSelectResult = Awaited<ReturnType<typeof __get>>;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async function __get(supabase: SupabaseInstance) {
		const { data } = await supabase.from("notifications").select(NOTIFICATIONS_SELECT).single();

		if (!data) {
			throw new Error("Bill not found");
		}

		return data;
	}

	function toClientNotification(selectResult: NotificationSelectResult): ClientNotification {
		switch (selectResult.type) {
			case "BillCreated":
			case "BillDeleted":
			case "BillUpdated":
				if (selectResult.bill === null) {
					throw new Error("Bill not found");
				}

				return selectResult as unknown as ClientNotification;

			case "TransactionWaiting":
			case "TransactionConfirmed":
			case "TransactionDeclined":
				if (selectResult.transaction === null) {
					throw new Error("Transaction not found");
				}

				return {
					...selectResult
				} as unknown as TransactionWaitingNotification;
			default:
				throw new Error(`Invalid notification type. Got: ${selectResult.type}`);
		}
	}

	export interface BasePayload {
		readonly userId: string;
		readonly triggerId: string;
	}

	export interface BaseBillPayload extends BasePayload {
		readonly billDisplayId: string;
	}

	export interface CreateBillPayload extends BaseBillPayload {
		readonly amount: number;
		readonly role: BillMemberRole;
	}

	export async function createManyBillCreated(supabase: SupabaseInstance, payload: CreateBillPayload[]) {
		await create(
			supabase,
			payload.filter(removeSelfNotification).map(({ role, amount, userId: user_id, triggerId: trigger_id, billDisplayId: bill_display_id }) => {
				return {
					user_id,
					trigger_id,
					bill_display_id,
					type: "BillCreated" as const satisfies NotificationType,
					metadata: { previous: {}, current: { role, amount } } satisfies BillCreatedNotificationMetadata
				};
			})
		);
	}

	export interface DeletedBillPayload extends BaseBillPayload {
		readonly role: BillMemberRole;
	}

	export async function createManyBillDeleted(supabase: SupabaseInstance, payloads: DeletedBillPayload[]) {
		await create(
			supabase,
			payloads.filter(removeSelfNotification).map(({ role, userId: user_id, triggerId: trigger_id, billDisplayId: bill_display_id }) => {
				return {
					user_id,
					trigger_id,
					bill_display_id,
					type: "BillDeleted" as const satisfies NotificationType,
					metadata: { current: {}, previous: { role } } satisfies BillDeletedNotificationMetadata
				};
			})
		);
	}

	export interface UpdatedBillPayload extends BaseBillPayload {
		readonly currentAmount: number;
		readonly previousAmount: number;
	}

	export async function createManyBillUpdated(supabase: SupabaseInstance, payloads: UpdatedBillPayload[]) {
		await create(
			supabase,
			payloads
				.filter(removeSelfNotification)
				.map(({ currentAmount, previousAmount, userId: user_id, triggerId: trigger_id, billDisplayId: bill_display_id }) => {
					return {
						user_id,
						trigger_id,
						bill_display_id,
						type: "BillUpdated" as const satisfies NotificationType,
						metadata: { current: { amount: currentAmount }, previous: { amount: previousAmount } } satisfies BillUpdatedNotificationMetadata
					};
				})
		);
	}

	export interface TransactionPayload extends BasePayload {
		readonly status: TransactionStatus;
		readonly transactionDisplayId: string;
	}
	export async function createTransaction(supabase: SupabaseInstance, payload: TransactionPayload) {
		const { status, userId: user_id, triggerId: trigger_id, transactionDisplayId: transaction_display_id } = payload;

		await create(supabase, [{ user_id, trigger_id, transaction_display_id, type: `Transaction${status}` }]);
	}

	const removeSelfNotification = (payload: BaseBillPayload) => payload.userId !== payload.triggerId;

	async function create(supabaseInstance: SupabaseInstance, payload: Database["public"]["Tables"]["notifications"]["Insert"][]) {
		const { data } = await supabaseInstance.from("notifications").insert(payload).select(NOTIFICATIONS_SELECT).throwOnError();

		if (!data) {
			throw new Error("Error creating notification");
		}

		notificationEvents.emit("notification:new", data.map(toClientNotification));
	}

	export async function readAll(supabase: SupabaseInstance, userId: string) {
		await supabase.from("notifications").update({ read_status: true }).eq("user_id", userId).throwOnError();
	}

	export async function read(supabase: SupabaseInstance, userId: string, notificationId: string) {
		await supabase.from("notifications").update({ read_status: true }).eq("id", notificationId).eq("user_id", userId).throwOnError();
	}

	export async function getUnread(supabase: SupabaseInstance, userId: string) {
		const { count } = await supabase
			.from("notifications")
			.select("id", { count: "exact" })
			.eq("user_id", userId)
			.eq("read_status", false)
			.throwOnError();

		return count ?? 0;
	}
}
