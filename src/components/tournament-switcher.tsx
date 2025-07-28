"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Users, Trophy, ChevronsUpDown } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Command, CommandItem, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandSeparator } from "@/components/shadcn/command";

import { cn } from "@/utils/cn";
import { extractTournamentId } from "@/utils/paths";
import { toLabel, getStatusColor } from "@/utils/strings";
import { type Tournament, type TournamentOverview } from "@/interfaces";

export const TournamentSwitcher: React.FC<{ tournaments: TournamentOverview[] }> = ({ tournaments }) => {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const router = useRouter();
	const pathname = usePathname();

	const currentTournamentId = extractTournamentId(pathname);
	const currentTournament = tournaments.find((t) => t.year === currentTournamentId);

	const handleTournamentSelect = (tournament: Tournament) => {
		if (tournament.id === currentTournamentId) {
			return;
		}

		setOpen(false);
		const nextUrl = pathname
			.split("/")
			.map((segment, segmentIndex) => {
				return segmentIndex === 2 ? tournament.year : segment;
			})
			.join("/");
		router.push(nextUrl);
	};

	const filteredTournaments = tournaments.filter(
		(tournament) =>
			tournament.name.toLowerCase().includes(searchValue.toLowerCase()) ||
			tournament.year.includes(searchValue) ||
			tournament.description?.toLowerCase().includes(searchValue.toLowerCase())
	);

	const activeTournaments = filteredTournaments.filter((t) => t.status === "ongoing");
	const completedTournaments = filteredTournaments.filter((t) => t.status === "completed");
	const upcomingTournaments = filteredTournaments.filter((t) => t.status === "upcoming");

	if (!currentTournament) {
		return null;
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role="combobox"
					variant="ghost"
					aria-expanded={open}
					aria-label="Select tournament"
					className="mr-2 justify-between bg-background px-3 py-2 pb-[0.52rem] hover:bg-[#0e0f1114] hover:dark:bg-[#ffffff1a]">
					<div className="flex min-w-0 items-center gap-2">
						<div className="flex min-w-0 flex-col items-start">
							<span className="truncate text-sm font-medium">{currentTournament.name}</span>
						</div>
					</div>
					<div className="flex items-center gap-1">
						<ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[400px] p-0">
				<Command>
					<div className="flex items-center border-b px-3">
						<CommandInput
							value={searchValue}
							onValueChange={setSearchValue}
							placeholder="Search tournaments..."
							className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<CommandList className="max-h-[400px]">
						<CommandEmpty>No tournaments found.</CommandEmpty>

						{/* Active Tournaments */}
						{activeTournaments.length > 0 && (
							<CommandGroup heading="Active Tournaments">
								{activeTournaments.map((tournament) => (
									<CommandItem
										key={tournament.id}
										className="flex items-center gap-2 px-2 py-2"
										value={`${tournament.name} ${tournament.year}`}
										onSelect={() => handleTournamentSelect(tournament)}>
										<Avatar className="h-6 w-6">
											<AvatarFallback className="bg-blue-100 text-xs text-blue-600">{tournament.year.slice(-2)}</AvatarFallback>
										</Avatar>
										<div className="flex min-w-0 flex-1 flex-col">
											<div className="flex items-center gap-2">
												<span className="truncate text-sm font-medium">{tournament.name}</span>
												<Badge variant="secondary" className={cn("px-1.5 py-0.5 text-xs", getStatusColor(tournament.status))}>
													{toLabel(tournament.status)}
												</Badge>
											</div>
											<div className="flex items-center gap-3 text-xs text-muted-foreground">
												<span>{tournament.year}</span>
												<div className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{tournament.totalPlayers}
												</div>
												<div className="flex items-center gap-1">
													<Trophy className="h-3 w-3" />
													{tournament.totalGroups}
												</div>
											</div>
										</div>
										<Check className={cn("ml-auto h-4 w-4", currentTournament.id === tournament.id ? "opacity-100" : "opacity-0")} />
									</CommandItem>
								))}
							</CommandGroup>
						)}

						{/* Upcoming Tournaments */}
						{upcomingTournaments.length > 0 && (
							<>
								{activeTournaments.length > 0 && <CommandSeparator />}
								<CommandGroup heading="Upcoming Tournaments">
									{upcomingTournaments.map((tournament) => (
										<CommandItem
											key={tournament.id}
											className="flex items-center gap-2 px-2 py-2"
											value={`${tournament.name} ${tournament.year}`}
											onSelect={() => handleTournamentSelect(tournament)}>
											<Avatar className="h-6 w-6">
												<AvatarFallback className="bg-gray-100 text-xs text-gray-600">{tournament.year.slice(-2)}</AvatarFallback>
											</Avatar>
											<div className="flex min-w-0 flex-1 flex-col">
												<div className="flex items-center gap-2">
													<span className="truncate text-sm font-medium">{tournament.name}</span>
													<Badge variant="secondary" className={cn("px-1.5 py-0.5 text-xs", getStatusColor(tournament.status))}>
														{toLabel(tournament.status)}
													</Badge>
												</div>
												<div className="flex items-center gap-3 text-xs text-muted-foreground">
													<span>{tournament.year}</span>
													<div className="flex items-center gap-1">
														<Users className="h-3 w-3" />
														{tournament.totalPlayers}
													</div>
													<div className="flex items-center gap-1">
														<Trophy className="h-3 w-3" />
														{tournament.totalGroups}
													</div>
												</div>
											</div>
											<Check className={cn("ml-auto h-4 w-4", currentTournament.id === tournament.id ? "opacity-100" : "opacity-0")} />
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}

						{/* Completed Tournaments */}
						{completedTournaments.length > 0 && (
							<>
								{(activeTournaments.length > 0 || upcomingTournaments.length > 0) && <CommandSeparator />}
								<CommandGroup heading="Completed Tournaments">
									{completedTournaments.map((tournament) => (
										<CommandItem
											key={tournament.id}
											className="flex items-center gap-2 px-2 py-2"
											value={`${tournament.name} ${tournament.year}`}
											onSelect={() => handleTournamentSelect(tournament)}>
											<Avatar className="h-6 w-6">
												<AvatarFallback className="bg-green-100 text-xs text-green-600">{tournament.year.slice(-2)}</AvatarFallback>
											</Avatar>
											<div className="flex min-w-0 flex-1 flex-col">
												<div className="flex items-center gap-2">
													<span className="truncate text-sm font-medium">{tournament.name}</span>
													<Badge variant="secondary" className={cn("px-1.5 py-0.5 text-xs", getStatusColor(tournament.status))}>
														{toLabel(tournament.status)}
													</Badge>
												</div>
												<div className="flex items-center gap-3 text-xs text-muted-foreground">
													<span>{tournament.year}</span>
													<div className="flex items-center gap-1">
														<Users className="h-3 w-3" />
														{tournament.totalPlayers}
													</div>
													<div className="flex items-center gap-1">
														<Trophy className="h-3 w-3" />
														{tournament.totalGroups}
													</div>
												</div>
											</div>
											<Check className={cn("ml-auto h-4 w-4", currentTournament.id === tournament.id ? "opacity-100" : "opacity-0")} />
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
