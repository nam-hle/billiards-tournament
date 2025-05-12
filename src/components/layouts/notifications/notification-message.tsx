import React from "react";
import { useRouter } from "next/navigation";

import { StatusDot } from "@/components/mics/status-dot";

import { formatDistanceTime } from "@/utils";
import { formatCurrency } from "@/utils/format";
import {
	type ClientNotification,
	type BillDeletedNotification,
	type BillUpdatedNotification,
	type BillCreatedNotification,
	type TransactionWaitingNotification,
	type TransactionDeclinedNotification,
	type TransactionConfirmedNotification
} from "@/schemas";

namespace NotificationMessage {
	export interface Props {
		onClick(): void;
		readonly notification: ClientNotification;
	}
}

export const NotificationMessage: React.FC<NotificationMessage.Props> = (props) => {
	const { onClick, notification } = props;
	const { createdAt, readStatus } = notification;

	const router = useRouter();
	const link = React.useMemo(() => renderLink(notification), [notification]);
	const message = React.useMemo(() => renderMessage(notification), [notification]);

	return (
		<div
			onClick={() => {
				if (link) {
					router.push(link);
				}

				onClick();
			}}
			className="flex cursor-pointer items-center justify-between gap-1 p-2 transition hover:bg-gray-200">
			<div className="flex flex-col gap-0">
				<p className="text-sm" data-testid="notification-text">
					{message}
				</p>
				<p className="text-xs text-gray-500">{formatDistanceTime(createdAt)}</p>
			</div>
			<div className="flex h-5 w-5 items-center justify-center">{!readStatus && <StatusDot value="info" />}</div>
		</div>
	);
};

function renderLink(notification: ClientNotification) {
	switch (notification.type) {
		case "BillCreated":
		case "BillDeleted":
		case "BillUpdated":
			return `/bills/${notification.bill.displayId}`;
		case "TransactionWaiting":
		case "TransactionConfirmed":
		case "TransactionDeclined":
			return `/transactions/${notification.transaction.displayId}`;
		default:
			return undefined;
	}
}

function computeMessage(notification: ClientNotification) {
	switch (notification.type) {
		case "BillCreated":
			return renderBillCreatedMessage(notification);
		case "BillDeleted":
			return renderBillDeletedMessage(notification);
		case "BillUpdated":
			return renderBillUpdatedMessage(notification);
		case "TransactionWaiting":
			return renderTransactionWaitingMessage(notification);
		case "TransactionDeclined":
			return renderTransactionDeclinedMessage(notification);
		case "TransactionConfirmed":
			return renderTransactionConfirmedMessage(notification);
		default:
			throw new Error("Invalid notification type");
	}
}

function format(amount: number) {
	return formatCurrency(amount, { noSuffix: true });
}

function renderTransactionConfirmedMessage(notification: TransactionConfirmedNotification) {
	const { transaction } = notification;
	const { amount, receiver } = transaction;

	return `Your transaction of **${format(amount)}** to **${receiver.fullName}** has been confirmed.`;
}

function renderTransactionDeclinedMessage(notification: TransactionDeclinedNotification) {
	const { transaction } = notification;
	const { sender, amount } = transaction;

	return `Your transaction of **${format(amount)}** from **${sender.fullName}** has been declined.`;
}

function renderTransactionWaitingMessage(notification: TransactionWaitingNotification) {
	const { transaction } = notification;
	const { sender, amount } = transaction;

	return `You have received a new transaction of **${format(amount)}** from **${sender.fullName}**. Please review and confirm it.`;
}

function renderBillCreatedMessage(notification: BillCreatedNotification) {
	const { bill, trigger, metadata } = notification;
	const { role, amount } = metadata.current;

	return `You've been added to the bill **${bill.description}** by **${trigger.fullName}** as a **${role}** with an amount of **${format(amount)}**.`;
}

function renderBillDeletedMessage(notification: BillDeletedNotification) {
	const { bill, trigger, metadata } = notification;
	const { role } = metadata.previous;

	return `You've been removed as a **${role}** from the bill **${bill.description}** by **${trigger.fullName}**.`;
}

function renderBillUpdatedMessage(notification: BillUpdatedNotification) {
	const { bill, trigger, metadata } = notification;
	const { current, previous } = metadata;

	return `Your amount in the bill **${bill.description}** has been updated from **${format(previous.amount)}** to **${format(current.amount)}** by **${trigger.fullName}**. Please review the change.`;
}

function transformMessage(text: string) {
	const parts = text.split(/(\*\*.+?\*\*)/);

	return parts.map((part, index) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			return <strong key={index}>{part.slice(2, -2)}</strong>;
		}

		return part;
	});
}

export function renderMessage(notification: ClientNotification) {
	return transformMessage(computeMessage(notification));
}
