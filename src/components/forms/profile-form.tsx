"use client";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { Input } from "@/components/shadcn/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";

import { Heading } from "@/components/mics/heading";
import { RequiredLabel } from "@/components/forms/required-label";
import { FileUpload } from "@/components/forms/inputs/file-upload";
import { LoadingButton } from "@/components/buttons/loading-button";

import { trpc } from "@/services";
import { type ProfileFormState } from "@/schemas";
import { getAvatarFallback } from "@/utils/avatar-fallback";

export const ProfileForm = () => {
	const form = useForm<ProfileFormState>({
		defaultValues: { fullName: "", avatarFile: "" }
	});
	const {
		reset,
		control,
		getValues,
		handleSubmit,
		formState: { isDirty, isSubmitting }
	} = form;

	const { data: profile } = trpc.user.profile.useQuery();

	React.useEffect(() => {
		if (profile) {
			reset({ fullName: profile.fullName, avatarFile: profile.avatarFile });
		}
	}, [reset, profile]);

	const { mutate, isPending } = trpc.user.updateProfile.useMutation({
		onError: () => {
			toast.error("Failed to update profile");
		},
		onSuccess: (data) => {
			reset({ fullName: data.fullName, avatarFile: data.avatarFile });
			toast.success("Profile updated", { description: "Your profile has been updated successfully." });
		}
	});

	const onSubmit = React.useMemo(() => handleSubmit((data) => mutate(data)), [handleSubmit, mutate]);

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="mx-auto w-[60%] space-y-4">
				<Heading>Profile</Heading>
				<div className="grid grid-cols-12 grid-rows-2 gap-2">
					<div className="col-span-9">
						<FormItem>
							<RequiredLabel>Email</RequiredLabel>
							<Input disabled value={profile?.email ?? ""} />
						</FormItem>
					</div>

					<div className="col-span-3 row-span-2 flex items-center justify-center self-center">
						<FormField
							name="avatarFile"
							control={control}
							render={({ field }) => (
								<FileUpload
									editing
									buttonSize="sm"
									bucketName="avatars"
									ownerId={profile?.userId}
									onChange={field.onChange}
									fileId={field.value ?? undefined}
									imageRenderer={(src) => (
										<Avatar className="h-20 w-20 cursor-pointer">
											<AvatarImage src={src} className="object-cover" />
											<AvatarFallback className="text-sm">{getAvatarFallback(getValues("fullName"))}</AvatarFallback>
										</Avatar>
									)}
								/>
							)}
						/>
					</div>

					<div className="col-span-9">
						<FormField
							name="fullName"
							control={control}
							render={({ field }) => (
								<FormItem>
									<RequiredLabel>Full Name</RequiredLabel>
									<FormControl>
										<Input placeholder="Enter full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-start">
					<LoadingButton size="sm" type="submit" disabled={!isDirty} loadingText="Updating..." loading={isSubmitting || isPending}>
						Update
					</LoadingButton>
				</div>
			</form>
		</Form>
	);
};
