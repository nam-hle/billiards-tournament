"use client";

import Link from "next/link";
import * as React from "react";
import { Check, Users, Settings, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Command, CommandItem, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandSeparator } from "@/components/shadcn/command";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { formatCurrency } from "@/utils/format";
import { useSwitchGroup } from "@/utils/use-switch-group";

export const GroupSwitcher = () => {
	const [open, setOpen] = React.useState(false);

	const { data: groups } = trpc.groups.groupsWithBalance.useQuery();
	const { data: selectedGroup } = trpc.user.selectedGroup.useQuery();

	const switchGroup = useSwitchGroup();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role="combobox"
					variant="outline"
					aria-expanded={open}
					aria-label="No selected group"
					data-testid="navigation-item-group-switcher"
					className={cn("h-12 w-[250px] justify-between")}>
					{selectedGroup ? (
						<div className="flex flex-col items-start">
							<span className="text-sm font-medium">{selectedGroup.name}</span>
							<span className="text-xs text-muted-foreground">Balance: {formatCurrency(selectedGroup.balance)}</span>
						</div>
					) : (
						<span className="text-muted-foreground">No selected group</span>
					)}
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[250px] p-0">
				<Command>
					{groups?.length ? <CommandInput placeholder="Search group..." /> : null}
					<CommandList>
						<CommandEmpty>No group found.</CommandEmpty>
						{groups?.length ? (
							<CommandGroup>
								{groups.map((group) => (
									<CommandItem key={group.id} className="flex items-center justify-between py-2 text-sm">
										<div
											className="flex flex-1 cursor-pointer items-center"
											onClick={() => {
												switchGroup.mutate({ groupId: group.id });
												setOpen(false);
											}}>
											<div className="flex flex-col">
												<span>{group.name}</span>
												<span className="text-xs text-muted-foreground">Balance: {formatCurrency(group.balance)}</span>
											</div>
											<span className="ml-auto mr-2 flex items-center text-xs text-muted-foreground">
												<Users className="mr-1 h-3 w-3" />
												{group.members.length}
											</span>
										</div>
										<Link
											href={`/groups/${group.displayId}`}
											className="text-muted-foreground hover:text-primary"
											onClick={(e) => {
												e.stopPropagation();
												setOpen(false);
											}}>
											<Settings className="h-4 w-4" />
										</Link>
										{selectedGroup?.id === group.id && <Check className="ml-2 h-4 w-4" />}
									</CommandItem>
								))}
							</CommandGroup>
						) : (
							<CommandItem>No groups available</CommandItem>
						)}
					</CommandList>
					<CommandSeparator />
					<CommandList>
						<CommandGroup>
							<CommandItem
								asChild
								className="cursor-pointer text-sm"
								onSelect={() => {
									setOpen(false);
								}}>
								<Link href="/groups" className="flex w-full cursor-pointer items-center">
									<Settings className="mr-2 h-5 w-5" />
									Manage Groups
								</Link>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
