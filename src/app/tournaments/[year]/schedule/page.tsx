"use client";

import { useState } from "react";
import { Users, Filter, Trophy, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

// Mock types - replace with your actual types
interface Props {
	params: Promise<{ year: string }>;
}

interface ScheduleMatch {
	id: string;
	venue?: string;
	round?: string;
	groupId: string;
	score1?: number;
	score2?: number;
	groupName: string;
	scheduledAt: string;
	player1: { id: string; name: string };
	player2: { id: string; name: string };
	status: "scheduled" | "in-progress" | "completed" | "postponed";
}

interface TournamentSchedule {
	year: string;
	name: string;
	groups: string[];
	matches: ScheduleMatch[];
}

// Mock repository - replace with your actual implementation
class ScheduleRepository {
	async getTournamentSchedule(year: string): Promise<TournamentSchedule> {
		return {
			year,
			name: "Championship Tournament",
			groups: ["Group A", "Group B", "Group C", "Group D"],
			matches: [
				{
					id: "1",
					score1: 3,
					score2: 1,
					groupId: "A",
					venue: "Court 1",
					round: "Round 1",
					status: "completed",
					groupName: "Group A",
					scheduledAt: "2024-01-15T14:00:00",
					player1: { id: "1", name: "John Smith" },
					player2: { id: "2", name: "Sarah Johnson" }
				},
				{
					id: "2",
					score1: 2,
					score2: 0,
					groupId: "A",
					venue: "Court 2",
					round: "Round 1",
					status: "completed",
					groupName: "Group A",
					scheduledAt: "2024-01-15T16:00:00",
					player1: { id: "3", name: "Mike Davis" },
					player2: { id: "4", name: "Emma Wilson" }
				},
				{
					id: "3",
					groupId: "B",
					venue: "Court 1",
					round: "Round 1",
					groupName: "Group B",
					status: "in-progress",
					scheduledAt: "2024-01-16T10:00:00",
					player1: { id: "5", name: "Alex Brown" },
					player2: { id: "6", name: "Lisa Garcia" }
				},
				{
					id: "4",
					groupId: "B",
					venue: "Court 2",
					round: "Round 1",
					status: "scheduled",
					groupName: "Group B",
					scheduledAt: "2024-01-16T14:00:00",
					player1: { id: "7", name: "David Lee" },
					player2: { id: "8", name: "Maria Rodriguez" }
				},
				{
					id: "5",
					groupId: "C",
					venue: "Court 1",
					round: "Round 1",
					status: "scheduled",
					groupName: "Group C",
					scheduledAt: "2024-01-17T09:00:00",
					player1: { id: "9", name: "James Wilson" },
					player2: { id: "10", name: "Anna Taylor" }
				},
				{
					id: "6",
					groupId: "A",
					venue: "Court 1",
					round: "Round 2",
					status: "postponed",
					groupName: "Group A",
					scheduledAt: "2024-01-18T15:00:00",
					player1: { id: "1", name: "John Smith" },
					player2: { id: "3", name: "Mike Davis" }
				}
			]
		};
	}
}

function ScheduleFilters({
	groups,
	selectedGroup,
	onGroupChange,
	selectedStatus,
	onStatusChange
}: {
	groups: string[];
	selectedGroup: string;
	selectedStatus: string;
	onGroupChange: (value: string) => void;
	onStatusChange: (value: string) => void;
}) {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Filter className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm font-medium">Filters:</span>
			</div>

			<Select value={selectedGroup} onValueChange={onGroupChange}>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="All Groups" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Groups</SelectItem>
					{groups.map((group) => (
						<SelectItem key={group} value={group}>
							{group}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={selectedStatus} onValueChange={onStatusChange}>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="All Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Status</SelectItem>
					<SelectItem value="scheduled">Scheduled</SelectItem>
					<SelectItem value="in-progress">In Progress</SelectItem>
					<SelectItem value="completed">Completed</SelectItem>
					<SelectItem value="postponed">Postponed</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function DaySchedule({ date, matches }: { date: string; matches: ScheduleMatch[] }) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			weekday: "long",
			year: "numeric"
		});
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString("en-US", {
			hour12: true,
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "in-progress":
				return "bg-blue-100 text-blue-800";
			case "scheduled":
				return "bg-gray-100 text-gray-800";
			case "postponed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "completed":
				return "Completed";
			case "in-progress":
				return "Live";
			case "scheduled":
				return "Scheduled";
			case "postponed":
				return "Postponed";
			default:
				return "Unknown";
		}
	};

	const getWinner = (match: ScheduleMatch) => {
		if (match.score1 != null && match.score2 != null) {
			if (match.score1 > match.score2) {
				return "player1";
			}

			if (match.score2 > match.score1) {
				return "player2";
			}
		}

		return null;
	};

	if (matches.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				<Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
				<p>No matches scheduled for this day</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="mb-6 flex items-center gap-2">
				<Calendar className="h-5 w-5 text-primary" />
				<h3 className="text-lg font-semibold">{date === "upcoming" ? "Upcoming Matches" : formatDate(date)}</h3>
				<Badge className="ml-2" variant="secondary">
					{matches.length} {matches.length === 1 ? "match" : "matches"}
				</Badge>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Time</TableHead>
								<TableHead className="w-[120px]">Group</TableHead>
								<TableHead>Player 1</TableHead>
								<TableHead className="w-[100px] text-center">Score</TableHead>
								<TableHead>Player 2</TableHead>
								<TableHead className="w-[100px]">Venue</TableHead>
								<TableHead className="w-[120px]">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{matches
								.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
								.map((match) => {
									const winner = getWinner(match);

									return (
										<TableRow key={match.id}>
											<TableCell className="font-mono text-sm">{formatTime(match.scheduledAt)}</TableCell>
											<TableCell>
												<div className="space-y-1">
													<Badge variant="outline" className="text-xs">
														{match.groupName}
													</Badge>
													{match.round && (
														<Badge variant="secondary" className="block w-fit text-xs">
															{match.round}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className={`font-medium ${winner === "player1" ? "text-green-600" : ""}`}>{match.player1.name}</span>
													{winner === "player1" && (
														<Badge variant="default" className="px-1 py-0 text-xs">
															W
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="text-center">
												{match.score1 != null && match.score2 != null ? (
													<Badge variant="outline" className="font-mono">
														{match.score1} : {match.score2}
													</Badge>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className={`font-medium ${winner === "player2" ? "text-green-600" : ""}`}>{match.player2.name}</span>
													{winner === "player2" && (
														<Badge variant="default" className="px-1 py-0 text-xs">
															W
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">{match.venue || "-"}</TableCell>
											<TableCell>
												<Badge className={getStatusColor(match.status)}>{getStatusText(match.status)}</Badge>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

export default async function TournamentSchedulePage({ params }: Props) {
	const { year } = await params;
	const scheduleRepo = new ScheduleRepository();
	const schedule = await scheduleRepo.getTournamentSchedule(year);

	return <SchedulePageClient schedule={schedule} />;
}

function SchedulePageClient({ schedule }: { schedule: TournamentSchedule }) {
	const [selectedGroup, setSelectedGroup] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

	// Filter matches
	const filteredMatches = schedule.matches.filter((match) => {
		const groupMatch = selectedGroup === "all" || match.groupName === selectedGroup;
		const statusMatch = selectedStatus === "all" || match.status === selectedStatus;

		return groupMatch && statusMatch;
	});

	// Group matches by date
	const matchesByDate = filteredMatches.reduce(
		(acc, match) => {
			const date = match.scheduledAt.split("T")[0];

			if (!acc[date]) {
				acc[date] = [];
			}

			acc[date].push(match);

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
	const upcomingMatches = filteredMatches.filter((match) => match.status === "scheduled" && new Date(match.scheduledAt) > new Date());
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
