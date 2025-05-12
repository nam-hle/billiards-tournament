"use client";

import { z } from "zod";
import React from "react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";
import { Card, CardTitle, CardHeader, CardFooter, CardContent } from "@/components/shadcn/card";

import { ImageDialog } from "@/components/dialogs/image-dialog";
import { RequiredLabel } from "@/components/forms/required-label";
import { FileUpload } from "@/components/forms/inputs/file-upload";
import { DatePicker } from "@/components/forms/inputs/date-picker";
import { BillMemberInputs } from "@/components/forms/inputs/bill-member-inputs";

import { API } from "@/api";
import { trpc } from "@/services";
import { useBoolean } from "@/hooks";
import { formatTime, formatDistanceTime } from "@/utils";
import { type ClientBill, type ClientBillMember } from "@/schemas";
import {
	IssuedAtField,
	IssuedAtFieldTransformer,
	OptionalAmountFieldSchema,
	RequiredAmountFieldSchema,
	OptionalAmountFieldTransformer,
	RequiredAmountFieldTransformer
} from "@/schemas/form.schema";

export namespace BillForm {
	export type Kind = { readonly type: "create" } | { readonly type: "update"; readonly bill: ClientBill };

	export interface Props {
		readonly kind: Kind;
	}
}

const CreditorSchema = z.object({ userId: z.string().min(1, "Creditor is required"), amount: RequiredAmountFieldSchema("Total amount is required") });
export namespace CreditorTransformer {
	export function toServer(member: z.infer<typeof CreditorSchema>) {
		return { ...member, amount: RequiredAmountFieldTransformer.toServer(member.amount) };
	}

	export function fromServer(member: ClientBillMember): z.infer<typeof CreditorSchema> {
		return { ...member, userId: member.user.userId, amount: RequiredAmountFieldTransformer.fromServer(member.amount) };
	}
}

const DebtorSchema = z.object({ amount: OptionalAmountFieldSchema, userId: z.string().min(1, "Debtor is required") });
export namespace DebtorTransformer {
	export function toServer(member: z.infer<typeof DebtorSchema>) {
		return { ...member, amount: OptionalAmountFieldTransformer.toServer(member.amount) };
	}

	export function fromServer(member: ClientBillMember): z.infer<typeof DebtorSchema> {
		return { ...member, userId: member.user.userId, amount: OptionalAmountFieldTransformer.fromServer(member.amount) };
	}
}

const BillFormStateSchema = API.Bills.UpsertBillSchema.extend({
	issuedAt: IssuedAtField,
	creditor: CreditorSchema,
	debtors: z.array(DebtorSchema)
});

export type BillFormState = z.infer<typeof BillFormStateSchema>;
namespace BillFormStateTransformer {
	export function fromServer(bill: ClientBill): BillFormState {
		return {
			...bill,
			creditor: CreditorTransformer.fromServer(bill.creditor),
			debtors: bill.debtors.map(DebtorTransformer.fromServer),
			issuedAt: IssuedAtFieldTransformer.fromServer(bill.issuedAt)
		};
	}

	export function toServer(formState: BillFormState): z.infer<typeof API.Bills.UpsertBillSchema> {
		return {
			...formState,
			creditor: CreditorTransformer.toServer(formState.creditor),
			debtors: formState.debtors.map(DebtorTransformer.toServer),
			issuedAt: IssuedAtFieldTransformer.toServer(formState.issuedAt)
		};
	}
}

function useBillForm(kind: BillForm.Kind) {
	return useForm<BillFormState>({
		resolver: zodResolver(BillFormStateSchema),
		defaultValues:
			kind.type === "update"
				? BillFormStateTransformer.fromServer(kind.bill)
				: {
						description: "",
						receiptFile: null,
						issuedAt: new Date(),
						creditor: { userId: "", amount: "" },
						debtors: [{ amount: "", userId: "" }]
					}
	});
}

export const BillForm: React.FC<BillForm.Props> = (props) => {
	const { kind } = props;
	const [editing, { setFalse: endEditing, setTrue: startEditing }] = useBoolean(() => kind.type === "create");

	const [commitId, setCommitId] = React.useState(() => (kind.type === "update" ? kind.bill.commitId : ""));

	const createBill = useCreateBill();
	const updateBill = useUpdateBill((commitId) => {
		endEditing();
		setCommitId(() => commitId);
	});

	const form = useBillForm(kind);
	const { watch, reset, control, handleSubmit } = form;

	watch("debtors");
	const { fields: debtors, append: appendDebtor, remove: removeDebtors } = useFieldArray({ control, name: "debtors" });

	const onSubmit = React.useMemo(() => {
		return handleSubmit((data) => {
			const bill = BillFormStateTransformer.toServer(data);

			if (kind.type === "create") {
				createBill(bill);
			} else if (kind.type === "update") {
				updateBill({ ...bill, commitId, displayId: kind.bill.displayId });
			} else {
				throw new Error("Invalid form type");
			}
		});
	}, [createBill, commitId, handleSubmit, kind, updateBill]);

	const { isPending: isPendingUsers } = trpc.groups.members.useQuery();
	const bill = React.useMemo(() => (kind.type === "update" ? kind.bill : undefined), [kind]);

	return (
		<Form {...form}>
			<div className="mb-6 mt-6 flex flex-col gap-4">
				<Card className="mx-auto w-full max-w-3xl">
					<CardHeader className="space-y-1 pb-2">
						<CardTitle className="min-h-9 text-2xl">
							{bill ? "Bill Details" : "Create New Bill"}
							{!editing && (
								<Button size="sm" variant="outline" onClick={startEditing} className="float-right ml-auto">
									Edit
								</Button>
							)}
						</CardTitle>
						{bill && (
							<div className="text-sm text-muted-foreground">
								Created <span title={formatTime(bill.creator.timestamp)}>{formatDistanceTime(bill.creator.timestamp)}</span> by{" "}
								{bill.creator.fullName}
								{bill.updater?.timestamp && (
									<>
										{" "}
										• Last updated <span title={formatTime(bill.updater?.timestamp)}>{formatDistanceTime(bill.updater?.timestamp)}</span> by{" "}
										{bill.updater?.fullName ?? "someone"}
									</>
								)}
							</div>
						)}
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-3">
								<div className="space-y-1">
									<FormField
										control={control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<RequiredLabel>Description</RequiredLabel>
												<FormControl>
													<Input
														readOnly={!editing}
														placeholder="Enter bill description"
														className={editing ? "" : "pointer-events-none"}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-1">
									<FormField
										name="issuedAt"
										control={control}
										render={({ field }) => <DatePicker label="Issued At" readonly={!editing} {...field} />}
									/>
								</div>
							</div>

							<div className="space-y-1">
								<FormField
									control={control}
									name="receiptFile"
									render={({ field }) => (
										<FileUpload
											buttonSize="md"
											editing={editing}
											bucketName="receipts"
											onChange={field.onChange}
											fileId={field.value ?? undefined}
											imageRenderer={(src) => <ImageDialog src={src} />}
											ownerId={kind.type === "update" ? kind.bill.id : undefined}
										/>
									)}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<h3 className="text-lg font-medium">Creditor</h3>
							<BillMemberInputs editing={editing} member={{ type: "creditor" }} />
						</div>

						<div className="space-y-3">
							<div className="flex min-h-9 items-center justify-between">
								<h3 className="text-lg font-medium">Debtors</h3>
								{editing && (
									<Button size="sm" variant="outline" onClick={() => appendDebtor({ amount: "", userId: "" })}>
										<PlusCircle className="mr-2 h-4 w-4" />
										Add Debtor
									</Button>
								)}
							</div>

							{debtors.map((debtor, debtorIndex) => (
								<BillMemberInputs
									key={debtor.id}
									editing={editing}
									onRemove={() => removeDebtors(debtorIndex)}
									member={{ debtorIndex, type: "debtor", lastDebtor: debtorIndex === debtors.length - 1 }}
								/>
							))}
						</div>
					</CardContent>

					{editing && (
						<CardFooter className="flex justify-end gap-2">
							{kind.type === "update" ? (
								<>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											endEditing();
											reset();
										}}>
										Cancel
									</Button>
									<Button size="sm" onClick={onSubmit}>
										Done
									</Button>
								</>
							) : (
								<Button size="sm" type="submit" onClick={onSubmit} disabled={isPendingUsers}>
									Create
								</Button>
							)}
						</CardFooter>
					)}
				</Card>
			</div>
			{/*<DevTool control={control} />*/}
		</Form>
	);
};

function useCreateBill() {
	const router = useRouter();
	const utils = trpc.useUtils();

	const { mutate } = trpc.bills.create.useMutation({
		onError: () => {
			toast.error("Failed to create bill");
		},
		onSuccess: () => {
			toast.success("A new bill has been created and saved successfully.");

			utils.bills.getMany.invalidate().then(() => router.push("/bills"));
		}
	});

	return mutate;
}

function useUpdateBill(onSuccess: (newCommitId: string) => void) {
	const utils = trpc.useUtils();

	const { mutate } = trpc.bills.update.useMutation({
		onError: (error) => {
			toast.error(error.data?.code === "CONFLICT" ? "The bil has been updated recently. Please reload and try again." : "Failed to update bill");
		},
		onSuccess: (data) => {
			toast.success("The bill details have been updated successfully.");

			utils.bills.getMany.invalidate().then(() => onSuccess(data.commitId));
		}
	});

	return mutate;
}
