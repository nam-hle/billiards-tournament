"use client";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "@/components/shadcn/dialog";

import { RequiredLabel } from "@/components/forms/required-label";
import { LoadingButton } from "@/components/buttons/loading-button";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { type NewGroupForm, NewGroupFormSchema } from "@/schemas";

export const NewGroupDialog = () => {
	const [open, setOpen] = useState(false);

	const form = useForm<NewGroupForm>({
		defaultValues: { name: "" },
		resolver: zodResolver(NewGroupFormSchema)
	});

	const {
		control,
		handleSubmit,
		formState: { isSubmitting }
	} = form;

	const utils = trpc.useUtils();
	const { mutate, isPending } = trpc.groups.create.useMutation({
		onError: () => {
			toast.error("Failed to create the group");
		},
		onSuccess: () => {
			utils.groups.groups.invalidate().then(() => {
				toast.success("Group created", { description: "New group has been created." });
				setOpen(false);
			});
		}
	});

	const onSubmit = React.useMemo(() => handleSubmit((data) => mutate(data)), [handleSubmit, mutate]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="h-4 w-4" />
					New
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Group</DialogTitle>
					<DialogDescription>Create a new group and invite people to join.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={onSubmit} className={cn("grid items-start gap-4")}>
						<FormField
							name="name"
							control={control}
							render={({ field }) => (
								<FormItem>
									<RequiredLabel>Name</RequiredLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<LoadingButton size="sm" type="submit" loadingText="Creating..." loading={isSubmitting || isPending}>
							Create
						</LoadingButton>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
