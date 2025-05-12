"use client";

import { toast } from "sonner";
import React, { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { X, Check, Loader2, UserPlus } from "lucide-react";

import { Label } from "@/components/shadcn/label";
import { Button } from "@/components/shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Command, CommandItem, CommandList, CommandEmpty, CommandGroup, CommandInput } from "@/components/shadcn/command";
import { Dialog, DialogTitle, DialogFooter, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "@/components/shadcn/dialog";

import { UserDisplay } from "@/components/avatars/user-display";

import { trpc } from "@/services";
import { type UserMeta } from "@/schemas";

namespace InviteDialog {
	export interface Props {
		readonly groupId: string;
	}
}

export const InviteDialog: React.FC<InviteDialog.Props> = ({ groupId }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [invitedUsers, setInvitedUsers] = useState<UserMeta[]>([]);
	const [open, setOpen] = useState(false);

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	const { data, isPending: isSearching } = trpc.groups.candidateMembers.useQuery(
		{ groupId, textSearch: debouncedSearchQuery },
		{ enabled: searchQuery !== "" }
	);

	const utils = trpc.useUtils();
	const mutation = trpc.groups.invite.useMutation({
		onSuccess: (data) => {
			if (data.every((result) => result.ok)) {
				toast.success("Send invites successfully");

				utils.groups.invitations.invalidate({ groupId }).then(() => {
					setIsOpen(false);
					setInvitedUsers([]);
				});
			} else {
				toast.error("Send invites failed");
			}
		}
	});

	const searchResults = data ?? [];

	const handleInvite = React.useCallback(
		(user: UserMeta) => {
			if (!invitedUsers.some((invited) => invited.userId === user.userId)) {
				setInvitedUsers([...invitedUsers, user]);
				setSearchQuery("");
				setOpen(false);
			}
		},
		[invitedUsers]
	);

	const removeInvite = React.useCallback(
		(id: string) => {
			setInvitedUsers(invitedUsers.filter((user) => user.userId !== id));
		},
		[invitedUsers]
	);

	const handleSendInvites = React.useCallback(() => {
		mutation.mutate({ groupId, userIds: invitedUsers.map((e) => e.userId) });
	}, [groupId, invitedUsers, mutation]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" />
					Invite
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Invite Group Members</DialogTitle>
					<DialogDescription>Search and invite members to your group.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Search for people</Label>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button role="combobox" variant="outline" aria-expanded={open} className="w-full justify-between">
									{searchQuery ? searchQuery : "Search by name..."}
									{isSearching ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
								</Button>
							</PopoverTrigger>
							<PopoverContent align="start" className="w-[375px] p-0">
								<Command shouldFilter={false}>
									<CommandInput value={searchQuery} onValueChange={setSearchQuery} placeholder="Type to search..." />
									<CommandList>
										{isSearching ? (
											<div className="flex items-center justify-center py-6">
												<Loader2 className="h-6 w-6 animate-spin text-primary" />
											</div>
										) : (
											<>
												<CommandEmpty>No people found.</CommandEmpty>
												<CommandGroup>
													{searchResults.map((user) => (
														<CommandItem key={user.userId} onSelect={() => handleInvite(user)} className="flex items-center gap-2">
															<UserDisplay {...user} />
															<Check className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
														</CommandItem>
													))}
												</CommandGroup>
											</>
										)}
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					{invitedUsers.length > 0 && (
						<div className="space-y-3">
							<Label>Invited people</Label>
							<div className="max-h-[200px] space-y-2 overflow-y-auto">
								{invitedUsers.map((user) => (
									<div key={user.userId} className="flex items-center justify-between rounded-md border p-2">
										<div className="flex items-center gap-3">
											<UserDisplay {...user} />
										</div>
										<Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => removeInvite(user.userId)}>
											<X className="h-4 w-4" />
											<span className="sr-only">Remove</span>
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button onClick={handleSendInvites} disabled={invitedUsers.length === 0}>
						Send Invites
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
