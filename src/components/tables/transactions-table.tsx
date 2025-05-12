"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/shadcn/button";

import { DataTable } from "@/components/tables/data-table";
import { UserDisplay } from "@/components/avatars/user-display";
import { FilterButton } from "@/components/buttons/filter-button";
import { TransactionStatusBadge } from "@/components/mics/transaction-status-badge";

import { trpc } from "@/services";
import { formatCurrency } from "@/utils/format";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
import { displayDate, displayDateAsTitle } from "@/utils";

namespace TransactionsTable {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const TransactionsTable: React.FC<TransactionsTable.Props> = (props) => {
	const { currentUserId } = props;

	const [page, setPage] = React.useState(DEFAULT_PAGE_NUMBER);

	const [filters, setFilters] = React.useState<"toMe" | "byMe" | undefined>(undefined);

	const { data } = trpc.transactions.getMany.useQuery(
		filters === "toMe" ? { page, receiverId: currentUserId } : filters === "byMe" ? { page, senderId: currentUserId } : { page },
		{
			select: (response) => {
				return {
					...response,
					data: response.data.map((transaction) => ({ ...transaction, id: transaction.displayId }))
				};
			}
		}
	);

	const createOwnerFilter = React.useCallback(
		(filterKey: "toMe" | "byMe") => {
			return {
				active: filters === filterKey,
				onClick: () => setFilters((prev) => (prev === filterKey ? undefined : filterKey))
			};
		},
		[filters]
	);

	return (
		<DataTable
			rowHeight={12}
			title="Transactions"
			pagination={{ pageNumber: page, onPageChange: setPage, fullSize: data?.fullSize }}
			data={data?.data.map((row) => ({ ...row, href: `/transactions/${row.displayId}` }))}
			action={
				<Button asChild size="sm">
					<Link href="/transactions/new">
						<Plus /> New
					</Link>
				</Button>
			}
			toolbar={
				<>
					<FilterButton {...createOwnerFilter("toMe")}>To Me</FilterButton>
					<FilterButton {...createOwnerFilter("byMe")}>By Me</FilterButton>
				</>
			}
			columns={[
				{ key: "id", label: "ID", dataGetter: ({ row }) => row.displayId },
				{
					key: "issuedAt",
					label: "Issued At",
					dataGetter: ({ row }) => displayDate(row.issuedAt),
					titleGetter: ({ row }) => displayDateAsTitle(row.issuedAt)
				},
				{ key: "sender", label: "Sender", dataGetter: ({ row }) => <UserDisplay {...row.sender} /> },
				{ key: "receiver", label: "Receiver", dataGetter: ({ row }) => <UserDisplay {...row.receiver} /> },
				{ key: "amount", label: "Amount", dataGetter: ({ row }) => formatCurrency(row.amount) },
				{ key: "status", label: "Status", dataGetter: ({ row }) => <TransactionStatusBadge status={row.status} /> }
			]}
		/>
	);
};
