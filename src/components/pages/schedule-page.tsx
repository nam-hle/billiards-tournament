"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Trophy, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";

import { DaySchedule } from "@/components/day-schedule";
import { PageHeader } from "@/components/layouts/page-header";
import { ScheduleFilters } from "@/components/schedule-filters";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { ALL_FILTER } from "@/constants";
import { Match, ISOTime, GroupMatch, ScheduledMatch, CompletedMatch, type Tournament, type TournamentSchedule } from "@/interfaces";

const GROUP_QUERY_KEY = "group";
const STATUS_QUERY_KEY = "status";
const PLAYER_QUERY_KEY = "player";

export function SchedulePageClient({ schedule, tournament }: { tournament: Tournament; schedule: TournamentSchedule }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [selectedGroupId, setSelectedGroupId] = useState(searchParams.get(GROUP_QUERY_KEY) ?? ALL_FILTER);
	const [selectedStatus, setSelectedStatus] = useState(searchParams.get(STATUS_QUERY_KEY) ?? ALL_FILTER);
	const [selectedPlayerId, setSelectedPlayerId] = useState(() => searchParams.get(PLAYER_QUERY_KEY) ?? ALL_FILTER);
	const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

	const createChangeHandler = React.useCallback(
		(setter: React.Dispatch<React.SetStateAction<string>>, queryKey: string) => {
			return (value: string) => {
				const params = new URLSearchParams(searchParams);

				if (value === ALL_FILTER) {
					params.delete(queryKey);
				} else {
					params.set(queryKey, value);
				}

				router.push(`?${params.toString()}`, { scroll: false });

				setter(() => value);
			};
		},
		[router, searchParams]
	);
	// Filter matches
	const filteredMatches = schedule.matches.filter((match) => {
		const groupMatch = selectedGroupId === "all" || (GroupMatch.isInstance(match) && match.groupId === selectedGroupId);
		const statusMatch = selectedStatus === "all" || Match.getStatus(match) === selectedStatus;
		const playerMatch = selectedPlayerId === "all" || match.player1Id === selectedPlayerId || match.player2Id === selectedPlayerId;

		return groupMatch && statusMatch && playerMatch;
	});

	// Group matches by date
	const matchesByDate = filteredMatches.reduce<Record<string, ScheduledMatch[]>>((acc, match) => {
		if (!ScheduledMatch.isInstance(match)) {
			return acc;
		}

		const date = ISOTime.getDate(match.scheduledAt);

		acc[date] ??= [];
		acc[date].push(match);

		return acc;
	}, {});

	const dates = Object.keys(matchesByDate).sort();
	const currentDateIndex = dates.indexOf(currentDate);

	const navigateDate = (direction: "prev" | "next") => {
		if (direction === "prev" && currentDateIndex > 0) {
			setCurrentDate(dates[currentDateIndex - 1]);
		} else if (direction === "next" && currentDateIndex < dates.length - 1) {
			setCurrentDate(dates[currentDateIndex + 1]);
		}
	};

	const todayMatches = matchesByDate[currentDate] || [];
	const upcomingMatches = filteredMatches.filter((match) => !CompletedMatch.isInstance(match));
	const completedMatches = filteredMatches.filter((match) => CompletedMatch.isInstance(match));
	const unscheduledMatches = filteredMatches.filter((match) => !ScheduledMatch.isInstance(match));

	return (
		<PageContainer
			items={[
				Links.Tournaments.get(),
				Links.Tournaments.Year.get(tournament.year, tournament.name),
				Links.Tournaments.Year.Schedule.get(tournament.year)
			]}>
			<PageHeader title="Schedule" description="View the full match schedule, including dates, times, and player pairings" />

			{/* Quick Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-green-100 p-2">
								<Users className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{completedMatches.length}</p>
								<p className="text-xs text-muted-foreground">Completed Matches</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-orange-100 p-2">
								<Calendar className="h-4 w-4 text-orange-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{upcomingMatches.length}</p>
								<p className="text-xs text-muted-foreground">Upcoming Matches</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-gray-100 p-2">
								<Trophy className="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{filteredMatches.length}</p>
								<p className="text-xs text-muted-foreground">Total Matches</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="pt-6">
					<ScheduleFilters
						groups={schedule.groups}
						players={schedule.players}
						selectedGroup={selectedGroupId}
						selectedStatus={selectedStatus}
						selectedPlayer={selectedPlayerId}
						onGroupChange={createChangeHandler(setSelectedGroupId, GROUP_QUERY_KEY)}
						onStatusChange={createChangeHandler(setSelectedStatus, STATUS_QUERY_KEY)}
						onPlayerChange={createChangeHandler(setSelectedPlayerId, PLAYER_QUERY_KEY)}
					/>
				</CardContent>
			</Card>

			{/* Schedule Tabs */}
			<Tabs defaultValue="all" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="all">All Matches</TabsTrigger>
					<TabsTrigger value="daily">Daily View</TabsTrigger>
					<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-6">
					{dates.map((date) => (
						<div key={date}>
							<DaySchedule date={date} groups={schedule.groups} matches={matchesByDate[date]} />
							{date !== dates[dates.length - 1] && <Separator className="my-8" />}
						</div>
					))}
					{unscheduledMatches.length > 0 && <DaySchedule date="unscheduled" groups={schedule.groups} matches={unscheduledMatches} />}
				</TabsContent>

				<TabsContent value="daily" className="space-y-6">
					{/* Date Navigation */}
					<div className="flex items-center justify-between">
						<Button variant="outline" disabled={currentDateIndex <= 0} onClick={() => navigateDate("prev")}>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Previous Day
						</Button>

						<div className="text-center">
							<p className="text-sm text-muted-foreground">Viewing</p>
							<p className="font-semibold">{ISOTime.formatDate(currentDate)}</p>
						</div>

						<Button variant="outline" onClick={() => navigateDate("next")} disabled={currentDateIndex >= dates.length - 1}>
							Next Day
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>

					<DaySchedule date={currentDate} matches={todayMatches} groups={schedule.groups} />
				</TabsContent>

				<TabsContent value="upcoming" className="space-y-6">
					<DaySchedule date="upcoming" groups={schedule.groups} matches={upcomingMatches} />
				</TabsContent>
			</Tabs>
		</PageContainer>
	);
}
