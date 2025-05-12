import React from "react";
import { toast } from "sonner";
import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";

import { trpc } from "@/services";
import { capitalize, convertVerb } from "@/utils";
import { type Transaction, TransactionStatusEnumSchema } from "@/schemas";

namespace TransactionAction {
	export interface Props {
		readonly currentUserId: string;
		readonly transaction: Transaction;
	}
}

export const TransactionAction: React.FC<TransactionAction.Props> = ({ transaction, currentUserId }) => {
	const router = useRouter();
	const utils = trpc.useUtils();

	const update = trpc.transactions.update.useMutation({
		onError: (_, { status }) => {
			toast.error(`Transaction ${capitalize(convertVerb(status).pastTense)}`);
		},
		onSuccess: (_, { status }) => {
			toast.success(`Transaction ${capitalize(convertVerb(status).pastTense)}`, {
				description: `The transaction has been ${convertVerb(status).pastTense} successfully`
			});

			utils.transactions.invalidate().then(() => router.refresh());
		}
	});

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.receiver.userId === currentUserId) {
		return (
			<Button
				size="sm"
				className="w-full"
				onClick={(event) => {
					event.stopPropagation();
					update.mutate({ status: "Confirmed", displayId: transaction.displayId });
				}}>
				<Check /> Confirm
			</Button>
		);
	}

	if (transaction.status === TransactionStatusEnumSchema.enum.Waiting && transaction.sender.userId === currentUserId) {
		return (
			<Button
				size="sm"
				className="w-full"
				variant="destructive"
				onClick={(event) => {
					event.stopPropagation();
					update.mutate({ status: "Declined", displayId: transaction.displayId });
				}}>
				<X /> Decline
			</Button>
		);
	}

	return null;
};
