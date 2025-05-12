import { z } from "zod";

import type { Database } from "@/database.types";
import { JsonSchema } from "@/schemas/base.schema";
import { TransactionNotificationSchema } from "@/schemas/transactions.schema";
import { ClientBillSchema, BillMemberRoleSchema } from "@/schemas/bills.schema";

const NotificationTypeSchema = z.enum([
	"BillCreated",
	"BillDeleted",
	"BillUpdated",
	"TransactionWaiting",
	"TransactionConfirmed",
	"TransactionDeclined"
] as const satisfies Database["public"]["Enums"]["NotificationType"][]);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

const ServerNotificationSchema = z.object({
	id: z.string(),
	createdAt: z.string(),
	readStatus: z.boolean(),
	userId: z.string().uuid(),
	metadata: JsonSchema.nullable()
});

const BaseClientNotificationSchema = ServerNotificationSchema.extend({
	type: NotificationTypeSchema,
	trigger: z.object({ fullName: z.string() })
});

const NotificationBillSchema = ClientBillSchema.pick({ displayId: true, description: true }).extend({
	creator: z.object({ fullName: z.string() })
});

const BillCreatedNotificationMetadataSchema = z.object({
	previous: z.object({}),
	current: z.object({ amount: z.number(), role: BillMemberRoleSchema })
});
export type BillCreatedNotificationMetadata = z.infer<typeof BillCreatedNotificationMetadataSchema>;

const BillCreatedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillCreated"),
	metadata: BillCreatedNotificationMetadataSchema
});
export type BillCreatedNotification = z.infer<typeof BillCreatedNotificationSchema>;

const BillDeletedNotificationMetadataSchema = z.object({
	current: z.object({}),
	previous: z.object({ role: BillMemberRoleSchema })
});
export type BillDeletedNotificationMetadata = z.infer<typeof BillDeletedNotificationMetadataSchema>;

const BillDeletedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillDeleted"),
	metadata: BillDeletedNotificationMetadataSchema
});
export type BillDeletedNotification = z.infer<typeof BillDeletedNotificationSchema>;

const BillUpdatedNotificationMetadataSchema = z.object({
	current: z.object({ amount: z.number() }),
	previous: z.object({ amount: z.number() })
});
export type BillUpdatedNotificationMetadata = z.infer<typeof BillUpdatedNotificationMetadataSchema>;

const BillUpdatedNotificationSchema = BaseClientNotificationSchema.extend({
	bill: NotificationBillSchema,
	type: z.literal("BillUpdated"),
	metadata: BillUpdatedNotificationMetadataSchema
});
export type BillUpdatedNotification = z.infer<typeof BillUpdatedNotificationSchema>;

const TransactionWaitingNotificationSchema = BaseClientNotificationSchema.extend({
	type: z.literal("TransactionWaiting"),
	transaction: TransactionNotificationSchema
});
export type TransactionWaitingNotification = z.infer<typeof TransactionWaitingNotificationSchema>;

const TransactionConfirmedNotificationSchema = BaseClientNotificationSchema.extend({
	type: z.literal("TransactionConfirmed"),
	transaction: TransactionNotificationSchema
});
export type TransactionConfirmedNotification = z.infer<typeof TransactionConfirmedNotificationSchema>;

const TransactionDeclinedNotificationSchema = BaseClientNotificationSchema.extend({
	type: z.literal("TransactionDeclined"),
	transaction: TransactionNotificationSchema
});
export type TransactionDeclinedNotification = z.infer<typeof TransactionDeclinedNotificationSchema>;

export const ClientNotificationSchema = z.union([
	BillCreatedNotificationSchema,
	BillDeletedNotificationSchema,
	BillUpdatedNotificationSchema,
	TransactionWaitingNotificationSchema,
	TransactionConfirmedNotificationSchema,
	TransactionDeclinedNotificationSchema
]);

export type ClientNotification = z.infer<typeof ClientNotificationSchema>;

export const InfiniteNotificationResponseSchema = z.object({
	nextCursor: z.string().nullable(),
	notifications: z.array(ClientNotificationSchema)
});
export const PaginatedNotificationResponseSchema = z.object({
	hasNextPage: z.boolean(),
	notifications: z.array(ClientNotificationSchema)
});
