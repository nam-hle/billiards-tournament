"use client";

import React from "react";
import { toast } from "sonner";
import { X, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";
import { Card, CardTitle, CardHeader, CardFooter, CardContent, CardDescription } from "@/components/shadcn/card";

import { Heading } from "@/components/mics/heading";
import { DataTable } from "@/components/tables/data-table";
import { CopyButton } from "@/components/buttons/copy-button";
import { UserDisplay } from "@/components/avatars/user-display";
import { InviteDialog } from "@/components/dialogs/invite-dialog";
import { RequiredLabel } from "@/components/forms/required-label";

import { trpc } from "@/services";
import { type GroupDetails, GroupDetailsSchema } from "@/schemas";

const TabLabels = {
	members: "Members",
	requests: "Requests",
	invitations: "Invitations"
} as const;
type TabName = keyof typeof TabLabels;

function computeTabLabel(tab: TabName, count: number | undefined) {
	return TabLabels[tab] + (count == undefined ? "" : ` (${count})`);
}

export const GroupForm: React.FC<{
	displayId: string;
}> = (props) => {
	const { displayId } = props;

	const { data: group } = trpc.groups.group.useQuery({ displayId });
	const { data: requests } = trpc.groups.requests.useQuery({ groupId: group?.id ?? "" }, { enabled: !!group });
	const { data: invites } = trpc.groups.invitations.useQuery({ groupId: group?.id ?? "" }, { enabled: !!group });

	const utils = trpc.useUtils();
	const accept = trpc.groups.acceptRequest.useMutation({
		onError: () => {
			toast.error("An error occurred while accepting the request");
		},
		onSuccess: () => {
			utils.groups.group
				.invalidate({ displayId })
				.then(() => utils.groups.requests.invalidate({ groupId: group?.id ?? "" }))
				.then(() => toast.success("You have successfully accepted the request!"));
		}
	});
	const reject = trpc.groups.rejectRequest.useMutation({
		onError: () => {
			toast.error("An error occurred while rejecting the request");
		},
		onSuccess: () => {
			utils.groups.requests.invalidate({ groupId: group?.id ?? "" }).then(() => toast.success("You have successfully rejected the request!"));
		}
	});

	const form = useForm<GroupDetails>({
		resolver: zodResolver(GroupDetailsSchema),
		defaultValues: { name: "", members: [], displayId: "" }
	});

	const update = trpc.groups.update.useMutation({
		onSuccess: () => {
			utils.groups.group.invalidate({ displayId }).then(() => toast.success("Group name has been updated successfully!"));
		}
	});

	const { reset, control, getValues, handleSubmit } = form;

	const onSubmit = React.useMemo(
		() => handleSubmit((data) => update.mutate({ name: data.name, groupId: group?.id ?? "" })),
		[group?.id, handleSubmit, update]
	);

	React.useEffect(() => {
		if (group) {
			reset(group);
		}
	}, [group, reset, getValues]);

	return (
		<div className="mx-auto flex max-w-md flex-col gap-4">
			<Heading>Group Details</Heading>

			<Form {...form}>
				<form onSubmit={onSubmit}>
					<FormField
						name="displayId"
						control={control}
						render={({ field }) => (
							<div className="flex items-end justify-between gap-2">
								<FormItem className="w-full">
									<RequiredLabel>ID</RequiredLabel>
									<FormControl>
										<Input readOnly className="pointer-events-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
								<CopyButton value={field.value} />
							</div>
						)}
					/>

					<div className="flex items-end justify-between gap-2">
						<FormField
							name="name"
							control={control}
							render={({ field }) => (
								<FormItem className="w-full">
									<RequiredLabel>Name </RequiredLabel>
									<FormControl>
										<Input placeholder="My group" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button size="sm" type="submit">
							Save
						</Button>
					</div>
				</form>
			</Form>

			<Tabs className="w-full" defaultValue="members">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="members">{computeTabLabel("members", group?.members.length)}</TabsTrigger>
					<TabsTrigger value="requests">{computeTabLabel("requests", requests?.length)}</TabsTrigger>
					<TabsTrigger value="invitations">{computeTabLabel("invitations", invites?.length)}</TabsTrigger>
				</TabsList>
				<TabsContent value="members">
					<Card>
						<CardHeader>
							<CardTitle>Members</CardTitle>
							<CardDescription>These are the people who are part of the group.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<DataTable
								hideHeading
								title="Members"
								data={group?.members.map((member) => ({ ...member, id: member.userId }))}
								columns={[
									{
										key: "name",
										label: "Name",
										dataGetter: ({ row }) => <UserDisplay {...row} />
									}
								]}
							/>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="requests">
					<Card>
						<CardHeader>
							<CardTitle>Requests</CardTitle>
							<CardDescription>People who want to join the group. Accept or reject them here.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<DataTable
								hideHeading
								data={requests}
								title="Requests"
								columns={[
									{
										key: "name",
										label: "Name",
										dataGetter: ({ row }) => <UserDisplay {...row.user} />
									},
									{
										label: "",
										key: "actions",
										alignment: "right",
										dataGetter: ({ row }) => (
											<div className="flex justify-end gap-2">
												<Button size="sm" title="Accept" variant="outline" onClick={() => accept.mutate({ requestId: row.id })}>
													<Check />
												</Button>
												<Button size="sm" title="Reject" variant="outline" onClick={() => reject.mutate({ requestId: row.id })}>
													<X />
												</Button>
											</div>
										)
									}
								]}
							/>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="invitations">
					<Card>
						<CardHeader>
							<CardTitle>Invitations</CardTitle>
							<CardDescription>People who have been invited to the group. They can accept or reject the invitation.</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<DataTable
								hideHeading
								data={invites}
								title="Invites"
								columns={[
									{
										key: "name",
										label: "Name",
										dataGetter: ({ row }) => <UserDisplay {...row.user} />
									}
								]}
							/>
						</CardContent>
						<CardFooter className="flex justify-end">{group && <InviteDialog groupId={group.id} />}</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};
