"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Users, Clock, Award, Trophy, Target, MapPin, Calendar, ArrowRight, TrendingUp } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";
import { CountdownTimer } from "@/components/countdown-timer";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { toLabel, getStatusColor } from "@/utils/strings";
import { Match, ISOTime, type TournamentData, DefinedPlayersMatch, type TournamentOverview } from "@/interfaces";

function NavigationCards({ year }: { year: string }) {
	const navigationItems = [
		{
			icon: Users,
			title: "Players",
			href: `/tournaments/${year}/players`,
			color: "bg-purple-100 text-purple-600",
			description: "Player profiles and statistics"
		},
		{
			icon: Calendar,
			title: "Schedule",
			color: "bg-green-100 text-green-600",
			href: `/tournaments/${year}/schedule`,
			description: "Complete match schedule and results"
		},
		{
			icon: Target,
			title: "Groups",
			color: "bg-blue-100 text-blue-600",
			href: `/tournaments/${year}/groups`,
			description: "View all tournament groups and standings"
		}
	] as const;

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
							<p className="text-2xl font-bold">5000 VND</p>
							<p className="text-xs text-muted-foreground">Prize Pool</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function TournamentPage({ data }: { data: TournamentData }) {
	const { groups, overview, topPlayers, recentMatches, upcomingMatches } = data;
	const { year } = overview;

	const completionPercentage = (overview.completedMatches / overview.totalMatches) * 100;

	return (
		<PageContainer items={[Links.Tournaments.get(), Links.Tournaments.Year.get(year, data.overview.name)]}>
			{/* Tournament Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Image width={56} height={56} src="/billiards-logo.svg" alt="Billiards Tournament Logo" />
					<div>
						<h1 className="text-4xl font-bold tracking-tight">{overview.name}</h1>
					</div>
				</div>

				<div className="flex justify-center">
					<Badge variant="secondary" className={getStatusColor(overview.status)}>
						{toLabel(overview.status)}
					</Badge>
				</div>

				<p className="mx-auto max-w-3xl text-muted-foreground">{overview.description}</p>

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

			{/* Tournament Stats */}
			<TournamentStats overview={overview} />

			{/* Countdown Timer */}
			{overview.status === "upcoming" && (
				<Card className="space-y-12 border-none py-8">
					<CardHeader>
						<CardTitle className="flex items-center justify-center gap-2 text-center">
							<Zap className="h-5 w-5" />
							Starts In
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CountdownTimer targetTime={overview.startDate} />
					</CardContent>
				</Card>
			)}

			{/* Tournament Progress */}
			{overview.status === "ongoing" && (
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
			)}

			{/* Navigation Cards */}
			<div>
				<h2 className="mb-6 text-2xl font-semibold">Tournament Sections</h2>
				<NavigationCards year={year} />
			</div>

			{/* Content Grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
										<TableCell className="font-medium">
											<PlayerDisplay player={player} showAvatar={false} />
										</TableCell>
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

				{/* Groups Summary */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
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
								<Link passHref key={group.id} className="flex" href={`/tournaments/${year}/groups/${group.id}`}>
									<div className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-accent">
										<div className="flex items-center gap-3">
											<Badge variant="outline">{group.name}</Badge>
											<div>
												<PlayerDisplay showLink={false} showAvatar={false} player={group.leader} />
												<p className="text-xs text-muted-foreground">
													{group.completedMatches}/{group.matches.length} matches
												</p>
											</div>
										</div>
										<div className="text-right">
											<Badge variant="secondary" className={getStatusColor(group.status)}>
												{toLabel(group.status)}
											</Badge>
											{!!group.leader?.points && <p className="mt-1 text-sm font-medium">{group.leader.points} pts</p>}
										</div>
									</div>
								</Link>
							))}
						</div>
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
								const { id, name, score1, score2, player2Name, player1Name } = match;

								return (
									<Link
										key={id}
										passHref
										href={`/matches/${match.id}`}
										className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{Match.formatId(match)}
												</Badge>
												<Badge variant="outline" className="text-xs">
													{name}
												</Badge>
												<span className="text-xs text-muted-foreground">{ISOTime.formatDateTime(match.scheduledAt)}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="font-medium">{player1Name}</span>
												<span className="text-muted-foreground">vs</span>
												<span className="font-medium">{player2Name}</span>
											</div>
										</div>
										<div className="text-right">
											<Badge variant="outline" className="font-mono">
												{score1} : {score2}
											</Badge>
										</div>
									</Link>
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
								return (
									<Link
										passHref
										key={match.id}
										href={`/matches/${match.id}`}
										className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
										<div className="w-full space-y-1">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													{Match.formatId(match)}
												</Badge>
												<Badge variant="outline" className="text-xs">
													{match.name}
												</Badge>
												<span className="text-xs text-muted-foreground">{ISOTime.formatDateTime(match.scheduledAt)}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="font-medium">{DefinedPlayersMatch.isInstance(match) ? match.player1Name : "TBD"}</span>
												<span className="text-muted-foreground">vs</span>
												<span className="font-medium">{DefinedPlayersMatch.isInstance(match) ? match.player2Name : "TBD"}</span>
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</PageContainer>
	);
}
