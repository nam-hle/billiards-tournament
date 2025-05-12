"use client";

import React from "react";

import { Heading } from "@/components/mics/heading";
import { TransactionCard } from "@/components/cards/transaction-card";

import { trpc } from "@/services/trpc/client";

namespace TransactionCardList {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const TransactionCardList: React.FC<TransactionCardList.Props> = ({ currentUserId }) => {
	const { data } = trpc.transactions.getMany.useQuery({ page: 1 });

	return (
		<div className="col-span-2 flex-1 space-y-4">
			<Heading>Recent Transactions</Heading>
			<div className="space-y-4">
				{data?.data.map((transaction) => <TransactionCard transaction={transaction} key={transaction.displayId} currentUserId={currentUserId} />)}
			</div>
		</div>
	);
};
