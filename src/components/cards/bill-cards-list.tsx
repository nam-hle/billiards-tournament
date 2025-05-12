"use client";

import { Heading } from "@/components/mics/heading";
import { BillCard } from "@/components/cards/bill-card";

import { trpc } from "@/services";

export function BillCardsList({ currentUserId }: { currentUserId: string }) {
	const { data } = trpc.bills.getMany.useQuery({ page: 1 });

	return (
		<div className="col-span-2 space-y-4" data-testid="card-list-container">
			<Heading data-testid="card-list-heading">Recent Bills</Heading>
			<div className="space-y-4" data-testid="card-list-content">
				{data?.data?.map((bill) => <BillCard bill={bill} key={bill.id} currentUserId={currentUserId} />)}
			</div>
		</div>
	);
}
