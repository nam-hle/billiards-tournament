import React from "react";
import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/shadcn/form";

import { Select } from "@/components/forms/inputs/select";
import { RequiredLabel } from "@/components/forms/required-label";
import { type BillFormState } from "@/components/forms/bill-form";
import { SkeletonWrapper } from "@/components/mics/skeleton-wrapper";
import { AmountInput } from "@/components/forms/inputs/amount-input";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";

namespace BillMemberInputs {
	export interface Props {
		readonly editing: boolean;
		readonly onRemove?: () => void;
		readonly member: { type: "creditor" } | { type: "debtor"; debtorIndex: number; lastDebtor: boolean };
	}
}

export const BillMemberInputs: React.FC<BillMemberInputs.Props> = (props) => {
	const { member, editing, onRemove } = props;
	const { watch, control, register, getValues } = useFormContext<BillFormState>();

	const { isSuccess, data: usersResponse, isPending: isLoadingUsers } = trpc.groups.members.useQuery();

	const fieldKey = React.useMemo(() => {
		if (member.type === "creditor") {
			return "creditor" as const;
		}

		return `debtors.${member.debtorIndex}` as const;
	}, [member]);

	watch("debtors");

	const members = React.useMemo(() => {
		if (!isSuccess) {
			return [];
		}

		if (member.type === "creditor") {
			return usersResponse;
		}

		const debtors = getValues("debtors");

		return usersResponse.filter((user) => {
			if (user.userId === debtors[member.debtorIndex]?.userId) {
				return true;
			}

			return !debtors.some(({ userId }) => userId === user.userId);
		});
	}, [getValues, member, isSuccess, usersResponse]);

	const amountLabel = React.useMemo(() => {
		if (member.type === "creditor") {
			return "Total Amount";
		}

		return `Amount`;
	}, [member]);

	const AmountLabel = member.type === "creditor" ? RequiredLabel : FormLabel;

	return (
		<div
			data-testid={fieldKey}
			className={cn("grid grid-cols-1 items-end gap-3 md:grid-cols-2", { "border-b pb-3": member.type === "debtor" && !member.lastDebtor })}>
			<div className="space-y-1">
				<FormField
					control={control}
					name={`${fieldKey}.userId`}
					render={({ field }) => (
						<FormItem>
							<RequiredLabel>Name</RequiredLabel>
							<SkeletonWrapper loading={isLoadingUsers} skeleton={<Skeleton className="h-10 w-full" />}>
								<Select
									{...register(`${fieldKey}.userId`)}
									disabled={!editing}
									value={field.value}
									onValueChange={field.onChange}
									items={members.map(({ userId: value, fullName: label }) => ({ label, value }))}
								/>
							</SkeletonWrapper>
						</FormItem>
					)}
				/>
			</div>

			<div className="flex flex-col items-end gap-2 space-y-2 md:flex-row md:space-y-0">
				<div className="flex-1 space-y-1">
					<FormField
						control={control}
						name={`${fieldKey}.amount`}
						render={({ field }) => (
							<FormItem>
								<AmountLabel>{amountLabel}</AmountLabel>
								<FormControl>
									<AmountInput disabled={!editing} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				{editing && onRemove && (
					<Button size="icon" variant="ghost" onClick={onRemove} title="Remove debtor" className="flex-shrink-0" data-testid={`remove-${fieldKey}`}>
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
};
