"use client";

import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/shadcn/card";

import { AvatarGroup } from "@/components/avatars/avatar-group";
import { FallbackAvatar } from "@/components/avatars/fallbackable-avatar";

import { formatTime } from "@/utils";
import { type ClientBill } from "@/schemas";
import { formatCurrency } from "@/utils/format";

namespace BillCard {
	export interface Props {
		readonly bill: ClientBill;
		readonly currentUserId: string;
	}
}

export const BillCard: React.FC<BillCard.Props> = ({ bill, currentUserId }) => {
	const currentUserDebtor = bill.debtors.find((debtor) => debtor.user.userId === currentUserId);

	return (
		<Link passHref prefetch legacyBehavior href={`/bills/${bill.displayId}`}>
			<Card data-testid="card" className="w-full cursor-pointer hover:border-gray-500">
				<CardContent className="p-4" data-testid="card-content">
					<div data-testid="card-body" className="flex items-start space-x-4">
						<FallbackAvatar {...bill.creditor.user} data-testid="bill-creditor" />
						<div className="min-w-0 flex-1">
							<h3 data-testid="bill-description" className="truncate text-sm font-medium">
								{bill.description}
							</h3>
							<span data-testid="creditor-amount" className="text-xs font-medium">
								{formatCurrency(bill.creditor.amount)}
							</span>
						</div>
						<div data-testid="debtors" className="flex flex-col items-start">
							{currentUserDebtor && <span className="text-sm font-medium text-red-600">-{formatCurrency(currentUserDebtor.amount)}</span>}
						</div>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<p className="truncate text-xs text-muted-foreground">{formatTime(bill.creator.timestamp)}</p>
						<AvatarGroup users={bill.debtors.map((debtor) => debtor.user)} />
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
