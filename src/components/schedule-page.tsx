"use client";

import { useState } from "react";
import { Users, Trophy, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";

import { DaySchedule } from "@/components/day-schedule";
import { ScheduleFilters } from "@/components/schedule-filters";

import { GroupMatch, type ScheduleMatch, type TournamentSchedule } from "@/interfaces";

export function SchedulePageClient({ schedule }: { schedule: TournamentSchedule }) {
	const [selectedGroup, setSelectedGroup] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

	// Filter matches
	const filteredMatches = schedule.matches.filter((match) => {
		const groupMatch = selectedGroup === "all" || (GroupMatch.isInstance(match) && match.groupId === selectedGroup);
		const statusMatch = selectedStatus === "all" || match.status === selectedStatus;

		return groupMatch && statusMatch;
	});

	// Group matches by date
	const matchesByDate = filteredMatches.reduce(
		(acc, match) => {
			if (!match.scheduledAt) {
				return acc;
			}

			if (!acc[match.scheduledAt.date]) {
				acc[match.scheduledAt.date] = [];
			}

			acc[match.scheduledAt.date].push(match);

			return acc;
		},
		{} as Record<string, ScheduleMatch[]>
	);

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
	const upcomingMatches = filteredMatches.filter(
		(match) => match.status === "scheduled" && match.scheduledAt && new Date(match.scheduledAt.date) > new Date()
	);
	const liveMatches = filteredMatches.filter((match) => match.status === "in-progress");

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Trophy className="h-8 w-8 text-primary" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tournament Schedule</h1>
						<p className="text-xl text-muted-foreground">
							{schedule.name} - {schedule.year}
						</p>
					</div>
				</div>
			</div>

			<Separator />

			{/* Quick Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-blue-100 p-2">
								<Users className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{liveMatches.length}</p>
								<p className="text-xs text-muted-foreground">Live Matches</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-green-100 p-2">
								<Calendar className="h-4 w-4 text-green-600" />
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
								<p className="text-2xl font-bold">{schedule.matches.length}</p>
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
						selectedGroup={selectedGroup}
						selectedStatus={selectedStatus}
						onGroupChange={setSelectedGroup}
						onStatusChange={setSelectedStatus}
					/>
				</CardContent>
			</Card>

			{/* Schedule Tabs */}
			<Tabs defaultValue="daily" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="daily">Daily View</TabsTrigger>
					<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
					<TabsTrigger value="all">All Matches</TabsTrigger>
				</TabsList>

				<TabsContent value="daily" className="space-y-6">
					{/* Date Navigation */}
					<div className="flex items-center justify-between">
						<Button variant="outline" disabled={currentDateIndex <= 0} onClick={() => navigateDate("prev")}>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Previous Day
						</Button>

						<div className="text-center">
							<p className="text-sm text-muted-foreground">Viewing</p>
							<p className="font-semibold">
								{new Date(currentDate).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									weekday: "long"
								})}
							</p>
						</div>

						<Button variant="outline" onClick={() => navigateDate("next")} disabled={currentDateIndex >= dates.length - 1}>
							Next Day
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>

					<DaySchedule date={currentDate} matches={todayMatches} />
				</TabsContent>

				<TabsContent value="upcoming" className="space-y-6">
					<DaySchedule date="upcoming" matches={upcomingMatches} />
				</TabsContent>

				<TabsContent value="all" className="space-y-6">
					{dates.map((date) => (
						<div key={date}>
							<DaySchedule date={date} matches={matchesByDate[date]} />
							{date !== dates[dates.length - 1] && <Separator className="my-8" />}
						</div>
					))}
				</TabsContent>
			</Tabs>
		</div>
	);
}
