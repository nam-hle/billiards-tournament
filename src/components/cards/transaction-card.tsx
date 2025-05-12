import Link from "next/link";

import { Card, CardContent } from "@/components/shadcn/card";

import { FallbackAvatar } from "@/components/avatars/fallbackable-avatar";
import { TransactionStatusBadge } from "@/components/mics/transaction-status-badge";

import { formatTime } from "@/utils";
import { type Transaction } from "@/schemas";
import { formatCurrency } from "@/utils/format";

export const TransactionCard = ({ transaction, currentUserId }: { currentUserId: string; transaction: Transaction }) => {
	const isReceived = transaction.receiver.userId === currentUserId;
	const other = isReceived ? transaction.sender : transaction.receiver;

	return (
		<Link passHref prefetch legacyBehavior href={`/transactions/${transaction.displayId}`}>
			<Card className="w-full cursor-pointer hover:border-gray-500">
				<CardContent className="p-4">
					<div className="flex items-center space-x-4">
						<FallbackAvatar {...other} />
						<div className="min-w-0 flex-1">
							<h3 className="truncate text-sm font-medium">{other.fullName}</h3>
						</div>
						<div className="flex flex-col items-end">
							<span className={`text-sm font-medium ${isReceived ? "text-green-600" : "text-red-600"}`}>
								{isReceived ? "+" : "-"}
								{formatCurrency(transaction.amount)}
							</span>
						</div>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<p className="truncate text-xs text-muted-foreground">{formatTime(transaction.createdAt)}</p>
						<TransactionStatusBadge status={transaction.status} />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
