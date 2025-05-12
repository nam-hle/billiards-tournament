"use client";

import React from "react";
import type * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/shadcn/card";
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/shadcn/form";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { SkeletonWrapper } from "@/components/mics/skeleton-wrapper";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { BankAccountTypeEnumSchema, BankAccountStatusEnumSchema, BankAccountCreatePayloadSchema } from "@/schemas";

const formSchema = BankAccountCreatePayloadSchema.pick({ isDefault: true, accountHolder: true, accountNumber: true, providerNumber: true });

type BankAccountFormValues = z.infer<typeof formSchema>;

export const BankAccountForm = () => {
	const form = useForm<BankAccountFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accountHolder: "",
			accountNumber: "",
			providerNumber: ""
		}
	});
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = form;

	const { data: banks = [], isPending: isLoadingBanks } = trpc.banks.get.useQuery();

	const router = useRouter();
	const utils = trpc.useUtils();

	const addBankAccount = trpc.user.addBankAccount.useMutation({
		onError: () => {
			toast.error("Failed to add bank account");
		},
		onSuccess: () => {
			toast.success("Bank account added");
			utils.user.bankAccounts.invalidate().then(() => router.push("/profile"));
		}
	});

	const onSubmit = React.useMemo(
		() =>
			handleSubmit((data) => {
				addBankAccount.mutate({
					...data,
					type: BankAccountTypeEnumSchema.enum.Bank,
					status: BankAccountStatusEnumSchema.enum.Active
				});
			}),
		[handleSubmit, addBankAccount]
	);

	return (
		<div className={cn("mx-auto mt-24 w-[400px] flex-1 items-center")}>
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle>Add Bank Account</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={onSubmit} className="space-y-4">
							<FormField
								control={control}
								name="providerNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Select Bank</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SkeletonWrapper loading={isLoadingBanks} skeleton={<Skeleton className="h-10 w-full" />}>
												<SelectTrigger>
													<SelectValue placeholder="Choose a bank" />
												</SelectTrigger>
											</SkeletonWrapper>
											<SelectContent>
												{banks.map(({ providerNumber, providerFullName, providerShortName }) => (
													<SelectItem key={providerNumber} value={providerNumber}>
														{`${providerFullName} (${providerShortName})`}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage>{errors.providerNumber?.message}</FormMessage>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="accountNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account Number</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Enter account number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="accountHolder"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Account Holder Name</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Account name" {...field} />
										</FormControl>
										<FormMessage>{errors.accountHolder?.message}</FormMessage>
									</FormItem>
								)}
							/>

							<FormField
								name="isDefault"
								control={control}
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Use as the default account</FormLabel>
										</div>
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={isSubmitting}>
								Add
							</Button>
						</form>
						{/*<DevTool control={control} />*/}
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};
