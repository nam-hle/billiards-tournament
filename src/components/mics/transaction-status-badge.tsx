import React from "react";
import { X, Check, Clock } from "lucide-react";

import { type TransactionStatus, TransactionStatusEnumSchema } from "@/schemas";

export const TransactionStatusBadge = ({ status }: { status: TransactionStatus }) => {
	switch (status) {
		case TransactionStatusEnumSchema.enum.Confirmed:
			return (
				<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800/20 dark:text-green-400">
					<Check className="mr-1 h-3 w-3" />
					Confirmed
				</span>
			);
		case TransactionStatusEnumSchema.enum.Declined:
			return (
				<span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-800/20 dark:text-red-400">
					<X className="mr-1 h-3 w-3" />
					Declined
				</span>
			);
		case TransactionStatusEnumSchema.enum.Waiting:
		default:
			return (
				<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
					<Clock className="mr-1 h-3 w-3" />
					Waiting
				</span>
			);
	}
};
