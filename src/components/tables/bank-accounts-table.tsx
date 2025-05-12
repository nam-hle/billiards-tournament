"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";

import { DataTable } from "@/components/tables/data-table";

import { trpc } from "@/services";
import { useBanks } from "@/hooks";
import { BankAccountStatusEnumSchema } from "@/schemas";

namespace BankAccountsTable {
	export interface Props {
		readonly currentUserId: string;
	}
}

export const BankAccountsTable: React.FC<BankAccountsTable.Props> = (props) => {
	const { currentUserId } = props;

	const { data } = trpc.user.bankAccounts.useQuery({ userId: currentUserId });

	const findBank = useBanks();

	const utils = trpc.useUtils();
	const setDefault = trpc.user.setDefaultAccount.useMutation({
		onError: () => {
			toast.error("Fail to set default account");
		},
		onSuccess: () => {
			utils.user.bankAccounts.invalidate().then(() => toast.success("Set default account successfully"));
		}
	});
	const updateStatus = trpc.user.updateAccountState.useMutation({
		onError: () => {
			toast.error("Fail to update account status");
		},
		onSuccess: () => {
			utils.user.bankAccounts.invalidate().then(() => toast.success("Update account status successfully"));
		}
	});

	return (
		<div className="mx-auto mt-6 flex w-[60%] flex-col gap-4">
			<DataTable
				data={data}
				rowHeight={12}
				title="Bank Accounts"
				action={
					<Button asChild size="sm">
						<Link href="/profile/banks/new">
							<Plus /> New
						</Link>
					</Button>
				}
				columns={[
					{
						label: "Bank",
						key: "provider",
						dataGetter: ({ row }) => findBank(row.providerNumber)?.providerShortName,
						titleGetter: ({ row }) => findBank(row.providerNumber)?.providerFullName
					},
					{ key: "accountNumber", label: "Account number", dataGetter: ({ row }) => row.accountNumber },
					{ key: "accountHolder", label: "Account holder", dataGetter: ({ row }) => row.accountHolder },
					{
						key: "status",
						label: "Status",
						alignment: "center",
						dataGetter: ({ row }) =>
							row.status === BankAccountStatusEnumSchema.enum.Active ? (
								<Badge variant="succeed">{BankAccountStatusEnumSchema.enum.Active}</Badge>
							) : (
								<Badge>{BankAccountStatusEnumSchema.enum.Inactive}</Badge>
							)
					},
					{
						key: "default",
						label: "Default",
						alignment: "center",
						dataGetter: ({ row }) =>
							row.isDefault ? (
								<div className="flex justify-center">
									<Check />
								</div>
							) : null
					},
					{
						label: "",
						key: "action",
						alignment: "center",
						dataGetter: ({ row }) => {
							return (
								<div className="flex space-x-2">
									<Button
										size="sm"
										variant="secondary"
										title="Set as Default Account"
										onClick={() => setDefault.mutate({ accountId: row.id })}
										disabled={row.isDefault || row.status === BankAccountStatusEnumSchema.enum.Inactive}>
										Set as Default
									</Button>
									{row.status === BankAccountStatusEnumSchema.enum.Active ? (
										<Button
											size="sm"
											disabled={row.isDefault}
											variant="destructive-outline"
											title={row.isDefault ? "Cannot deactivate default account" : "Deactivate Account"}
											onClick={() => updateStatus.mutate({ accountId: row.id, status: BankAccountStatusEnumSchema.enum.Inactive })}>
											Deactivate
										</Button>
									) : row.status === BankAccountStatusEnumSchema.enum.Inactive ? (
										<Button
											size="sm"
											variant="secondary"
											onClick={() => updateStatus.mutate({ accountId: row.id, status: BankAccountStatusEnumSchema.enum.Active })}>
											Activate
										</Button>
									) : null}
								</div>
							);
						}
					}
				]}
			/>
		</div>
	);
};
