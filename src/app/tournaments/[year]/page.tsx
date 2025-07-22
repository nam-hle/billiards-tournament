import Link from "next/link";
import { Users, Clock, Award, Trophy, Target, MapPin, Calendar, ArrowRight, TrendingUp } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { formatDate, formatTime } from "@/components/day-schedule";

import { assert } from "@/utils";
import { type TournamentOverview } from "@/interfaces";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ year: string }>;
}

function NavigationCards({ year }: { year: string }) {
	const navigationItems = [
		{
			icon: Target,
			title: "Groups",
			color: "bg-blue-100 text-blue-600",
			href: `/tournaments/${year}/groups`,
			description: "View all tournament groups and standings"
		},
		{
			icon: Calendar,
			title: "Schedule",
			color: "bg-green-100 text-green-600",
			href: `/tournaments/${year}/schedule`,
			description: "Complete match schedule and results"
		},
		{
			icon: Users,
			title: "Players",
			href: `/tournaments/${year}/players`,
			color: "bg-purple-100 text-purple-600",
			description: "Player profiles and statistics"
		}
	];

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			{navigationItems.map((item) => (
				<Card key={item.title} className="cursor-pointer transition-shadow hover:shadow-lg">
					<CardContent className="p-6">
						<div className="mb-4 flex items-start justify-between">
							<div className={`rounded-lg p-3 ${item.color}`}>
								<item.icon className="h-6 w-6" />
							</div>
							<ArrowRight className="h-5 w-5 text-muted-foreground" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
						<p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
						<Button asChild className="w-full">
							<Link href={item.href}>View {item.title}</Link>
						</Button>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function TournamentStats({ overview }: { overview: TournamentOverview }) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-blue-100 p-2">
							<Users className="h-4 w-4 text-blue-600" />
						</div>
						<div>
							<p className="text-2xl font-bold">{overview.totalPlayers}</p>
							<p className="text-xs text-muted-foreground">Players</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-green-100 p-2">
							<Target className="h-4 w-4 text-green-600" />
						</div>
						<div>
							<p className="text-2xl font-bold">{overview.totalGroups}</p>
							<p className="text-xs text-muted-foreground">Groups</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-purple-100 p-2">
							<Trophy className="h-4 w-4 text-purple-600" />
						</div>
						<div>
							<p className="text-2xl font-bold">
								{overview.completedMatches}/{overview.totalMatches}
							</p>
							<p className="text-xs text-muted-foreground">Matches</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-2">
						<div className="rounded-lg bg-yellow-100 p-2">
							<Award className="h-4 w-4 text-yellow-600" />
						</div>
						<div>
							<p className="text-2xl font-bold">5000 USD</p>
							<p className="text-xs text-muted-foreground">Prize Pool</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default async function TournamentOverviewPage({ params }: Props) {
	const { year } = await params;
	const data = await new TournamentRepository().getData(year);

	const { groups, overview, topPlayers, recentMatches, upcomingMatches } = data;

	const completionPercentage = (overview.completedMatches / overview.totalMatches) * 100;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "active":
				return "bg-blue-100 text-blue-800";
			case "upcoming":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "completed":
				return "Completed";
			case "active":
				return "In Progress";
			case "upcoming":
				return "Upcoming";
			default:
				return "Unknown";
		}
	};

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Tournament Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Trophy className="h-10 w-10 text-primary" />
					<div>
						<h1 className="text-4xl font-bold tracking-tight">{overview.name}</h1>
					</div>
				</div>

				<div className="flex justify-center">
					<Badge variant="secondary" className={getStatusColor(overview.status)}>
						{getStatusText(overview.status)}
					</Badge>
				</div>

				<p className="mx-auto max-w-2xl text-muted-foreground">{overview.description}</p>

				<div className="flex justify-center gap-8 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						{new Date(overview.startDate).toLocaleDateString()} - {new Date(overview.endDate).toLocaleDateString()}
					</div>
					<div className="flex items-center gap-1">
						<MapPin className="h-4 w-4" />
						{overview.venue}
					</div>
				</div>
			</div>

			<Separator />

			{/* Tournament Stats */}
			<TournamentStats overview={overview} />

			{/* Tournament Progress */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Tournament Progress
					</CardTitle>
					<CardDescription>Overall completion status</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Matches Completed</span>
							<span>{Math.round(completionPercentage)}%</span>
						</div>
						<Progress className="h-3" value={completionPercentage} />
						<p className="text-xs text-muted-foreground">
							{overview.completedMatches} of {overview.totalMatches} matches completed
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Navigation Cards */}
			<div>
				<h2 className="mb-6 text-2xl font-semibold">Tournament Sections</h2>
				<NavigationCards year={year} />
			</div>

			{/* Content Grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Groups Summary */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Target className="h-5 w-5" />
								Groups Overview
							</CardTitle>
							<Button asChild size="sm" variant="outline">
								<Link href={`/tournaments/${year}/groups`}>
									View All
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
						<CardDescription>Current standings by group</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{groups.map((group) => (
								<div key={group.id} className="flex items-center justify-between rounded-lg border p-3">
									<div className="flex items-center gap-3">
										<Badge variant="outline">{group.name}</Badge>
										<div>
											<p className="font-medium">{group.leader?.name ?? "Undetermined"}</p>
											<p className="text-xs text-muted-foreground">
												{group.completedMatches}/{group.matches.length} matches
											</p>
										</div>
									</div>
									<div className="text-right">
										<Badge variant="secondary" className={getStatusColor(group.status)}>
											{getStatusText(group.status)}
										</Badge>
										{!!group.leader?.points && <p className="mt-1 text-sm font-medium">{group.leader.points} pts</p>}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Top Players */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Award className="h-5 w-5" />
								Top Players
							</CardTitle>
							<Button asChild size="sm" variant="outline">
								<Link href={`/tournaments/${year}/players`}>
									View All
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
						<CardDescription>Leading players by points</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[50px]">Rank</TableHead>
									<TableHead>Player</TableHead>
									<TableHead className="text-center">Wins</TableHead>
									<TableHead className="text-center">Points</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topPlayers.map((player, index) => (
									<TableRow key={player.name}>
										<TableCell>
											<Badge variant={index === 0 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
												{index + 1}
											</Badge>
										</TableCell>
										<TableCell className="font-medium">{player.name}</TableCell>
										<TableCell className="text-center">{player.wins}</TableCell>
										<TableCell className="text-center">
											<Badge variant="secondary">{player.points}</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			{/* Recent & Upcoming Matches */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Recent Matches */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Trophy className="h-5 w-5" />
								Recent Results
							</CardTitle>
							<Button asChild size="sm" variant="outline">
								<Link href={`/tournaments/${year}/schedule`}>
									View Schedule
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
						<CardDescription>Latest match results</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentMatches.map((match) => {
								const { score1, score2, scheduledAt } = match;
								assert(scheduledAt, "Match must have a scheduledAt date");
								assert(score1, "Match must have a score1");
								assert(score2, "Match must have a score2");
								const date = formatDate(scheduledAt.date);
								const time = formatTime(scheduledAt.time);

								return (
									<div key={match.id} className="flex items-center justify-between rounded-lg border p-3">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{match.name}
												</Badge>
												<span className="text-xs text-muted-foreground">
													{date} at {time}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="font-medium">{match.player1Name}</span>
												<span className="text-muted-foreground">vs</span>
												<span className="font-medium">{match.player2Name}</span>
											</div>
										</div>
										<div className="text-right">
											<Badge variant="outline" className="font-mono">
												{match.score1} : {match.score2}
											</Badge>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				{/* Upcoming Matches */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Upcoming Matches
						</CardTitle>
						<CardDescription>Next scheduled matches</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{upcomingMatches.map((match) => {
								const { scheduledAt } = match;
								assert(scheduledAt, "Match must have a scheduledAt date");
								const date = formatDate(scheduledAt.date);
								const time = formatTime(scheduledAt.time);

								return (
									<div key={match.id} className="flex items-center justify-between rounded-lg border p-3">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{match.name}
												</Badge>
												<span className="text-xs text-muted-foreground">
													{date} at {time}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="font-medium">{match.player1Name}</span>
												<span className="text-muted-foreground">vs</span>
												<span className="font-medium">{match.player2Name}</span>
											</div>
										</div>
										{/*<div className="text-right">*/}
										{/*	<div className="flex items-center gap-1 text-xs text-muted-foreground">*/}
										{/*		<MapPin className="h-3 w-3" />*/}
										{/*		{match.venue}*/}
										{/*	</div>*/}
										{/*</div>*/}
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
