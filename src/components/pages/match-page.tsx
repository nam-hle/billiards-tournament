"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Clock, Users, MapPin, Target, Trophy, History, Percent, Calendar, ArrowLeft } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { type Player, type MatchDetails, type MatchPrediction, type HeadToHeadRecord } from "@/app/matches/[matchId]/page";

function CountdownTimer({ targetDate }: { targetDate: string }) {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	});

	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date().getTime();
			const target = new Date(targetDate).getTime();
			const difference = target - now;

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					seconds: Math.floor((difference % (1000 * 60)) / 1000),
					minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
					hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				});
			} else {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [targetDate]);

	return (
		<div className="grid grid-cols-4 gap-4 text-center">
			<div className="rounded-lg bg-primary/10 p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
				<div className="text-xs text-muted-foreground">Days</div>
			</div>
			<div className="rounded-lg bg-primary/10 p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
				<div className="text-xs text-muted-foreground">Hours</div>
			</div>
			<div className="rounded-lg bg-primary/10 p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
				<div className="text-xs text-muted-foreground">Minutes</div>
			</div>
			<div className="rounded-lg bg-primary/10 p-3">
				<div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
				<div className="text-xs text-muted-foreground">Seconds</div>
			</div>
		</div>
	);
}

export function PlayerCard({ player, isPlayer1 = true }: { player: Player; isPlayer1?: boolean }) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-4 text-center">
					<Avatar className="mx-auto h-20 w-20">
						<AvatarImage alt={player.name} src={player.avatar || "/placeholder.svg"} />
						<AvatarFallback className="text-lg">
							{player.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>

					<div>
						<h3 className="text-xl font-bold">{player.name}</h3>
						<div className="mt-2 flex items-center justify-center gap-2">
							{player.seed && <Badge variant="outline">Seed #{player.seed}</Badge>}
							<Badge variant="secondary">Rank #{player.ranking}</Badge>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="text-lg font-bold">{player.wins}</div>
							<div className="text-xs text-muted-foreground">Wins</div>
						</div>
						<div>
							<div className="text-lg font-bold">{player.losses}</div>
							<div className="text-xs text-muted-foreground">Losses</div>
						</div>
						<div>
							<div className="text-lg font-bold">{player.winRate.toFixed(1)}%</div>
							<div className="text-xs text-muted-foreground">Win Rate</div>
						</div>
					</div>

					<div>
						<div className="mb-2 text-sm font-medium">Current Form</div>
						<div className="flex justify-center gap-1">
							{player.currentForm.map((result, index) => (
								<div
									key={index}
									className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
										result === "W" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
									}`}>
									{result}
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function WinPrediction({ prediction }: { prediction: MatchPrediction }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Percent className="h-5 w-5" />
					Win Prediction
				</CardTitle>
				<CardDescription>AI-powered match outcome prediction</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-4">
					<div>
						<div className="mb-2 flex justify-between text-sm">
							<span>Sarah Johnson</span>
							<span className="font-bold">{prediction.player1WinChance}%</span>
						</div>
						<Progress className="h-3" value={prediction.player1WinChance} />
					</div>
					<div>
						<div className="mb-2 flex justify-between text-sm">
							<span>John Smith</span>
							<span className="font-bold">{prediction.player2WinChance}%</span>
						</div>
						<Progress className="h-3" value={prediction.player2WinChance} />
					</div>
				</div>

				<div className="border-t pt-4">
					<div className="mb-3 flex items-center gap-2">
						<Badge variant={prediction.confidence === "high" ? "default" : prediction.confidence === "medium" ? "secondary" : "outline"}>
							{prediction.confidence.charAt(0).toUpperCase() + prediction.confidence.slice(1)} Confidence
						</Badge>
					</div>

					<div className="space-y-2">
						{prediction.factors.map((factor, index) => (
							<div key={index} className="flex items-start gap-2 text-sm">
								<div
									className={`mt-2 h-2 w-2 rounded-full ${
										factor.impact === "positive" ? "bg-green-500" : factor.impact === "negative" ? "bg-red-500" : "bg-gray-400"
									}`}
								/>
								<div>
									<span className="font-medium">{factor.factor}:</span>
									<span className="ml-1 text-muted-foreground">{factor.description}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function HeadToHeadHistory({ headToHead }: { headToHead: HeadToHeadRecord }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<History className="h-5 w-5" />
					Head-to-Head Record
				</CardTitle>
				<CardDescription>Previous meetings between these players</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="text-center">
					<div className="mb-2 text-3xl font-bold">
						{headToHead.player1Wins} - {headToHead.player2Wins}
					</div>
					<div className="text-sm text-muted-foreground">Sarah leads the series ({headToHead.totalMatches} matches played)</div>
				</div>

				{headToHead.lastMeeting && (
					<div className="border-t pt-4">
						<h4 className="mb-3 font-medium">Last Meeting</h4>
						<div className="rounded-lg bg-gray-50 p-3">
							<div className="mb-2 flex items-center justify-between">
								<span className="font-medium">{headToHead.lastMeeting.tournament}</span>
								<Badge variant="outline">{headToHead.lastMeeting.score}</Badge>
							</div>
							<div className="text-sm text-muted-foreground">
								{headToHead.lastMeeting.winner} won • {new Date(headToHead.lastMeeting.date).toLocaleDateString()}
							</div>
						</div>
					</div>
				)}

				<div className="border-t pt-4">
					<h4 className="mb-3 font-medium">Recent Results</h4>
					<div className="space-y-2">
						{headToHead.recentResults.map((result, index) => (
							<div key={index} className="flex items-center justify-between border-b py-2 last:border-b-0">
								<div>
									<div className="font-medium">{result.winner}</div>
									<div className="text-xs text-muted-foreground">{result.tournament}</div>
								</div>
								<div className="text-right">
									<Badge className="mb-1" variant="outline">
										{result.score}
									</Badge>
									<div className="text-xs text-muted-foreground">{new Date(result.date).toLocaleDateString()}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function RecentForm({ title, player }: { title: string; player: Player }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title} - Recent Form</CardTitle>
				<CardDescription>Last 5 matches performance</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Opponent</TableHead>
							<TableHead className="text-center">Score</TableHead>
							<TableHead className="text-center">Result</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{player.recentMatches.map((match, index) => (
							<TableRow key={index}>
								<TableCell className="font-mono text-sm">
									{new Date(match.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric"
									})}
								</TableCell>
								<TableCell className="font-medium">{match.opponent}</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline" className="font-mono">
										{match.score}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant={match.result === "W" ? "default" : "secondary"}
										className={match.result === "W" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
										{match.result === "W" ? "Win" : "Loss"}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

namespace MatchDetailsPage {
	export interface Props {
		readonly year: string;
		readonly match: MatchDetails;
	}
}

export function MatchDetailsPage({ year, match }: MatchDetailsPage.Props) {
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

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);

		return {
			time: date.toLocaleTimeString("en-US", {
				hour12: true,
				hour: "2-digit",
				minute: "2-digit"
			}),
			date: date.toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				weekday: "long",
				year: "numeric"
			})
		};
	};

	const { date, time } = formatDateTime(match.scheduledAt);

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Back Button */}
			<Button asChild size="sm" variant="outline">
				<Link href={`/tournaments/${year}/schedule`}>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Schedule
				</Link>
			</Button>

			{/* Match Header */}
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-4 text-center">
						<div className="flex items-center justify-center gap-2">
							<Badge variant="outline" className="text-sm">
								{match.tournament.stage.charAt(0).toUpperCase() + match.tournament.stage.slice(1)}
							</Badge>
							<Badge className={getStatusColor(match.status)}>{getStatusText(match.status)}</Badge>
						</div>

						<div>
							<h1 className="mb-2 text-2xl font-bold">
								{match.tournament.name} {match.tournament.year}
							</h1>
							<p className="text-lg text-muted-foreground">{match.tournament.round}</p>
						</div>

						<div className="flex justify-center gap-8 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								{date}
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								{time}
							</div>
							<div className="flex items-center gap-1">
								<MapPin className="h-4 w-4" />
								{match.venue} - {match.court}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Countdown Timer */}
			{match.status === "scheduled" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-center gap-2 text-center">
							<Zap className="h-5 w-5" />
							Match Starts In
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CountdownTimer targetDate={match.scheduledAt} />
					</CardContent>
				</Card>
			)}

			{/* Players Comparison */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<PlayerCard isPlayer1 player={match.player1} />
				<PlayerCard isPlayer1={false} player={match.player2} />
			</div>

			{/* Win Prediction */}
			<WinPrediction prediction={match.prediction} />

			{/* Additional Information */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
							<div className="font-medium">Referee</div>
							<div className="text-sm text-muted-foreground">{match.referee}</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<Trophy className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
							<div className="font-medium">Broadcast</div>
							<div className="text-sm text-muted-foreground">{match.broadcastInfo?.channel}</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center">
							<Target className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
							<div className="font-medium">Tickets</div>
							<div className="text-sm text-muted-foreground">{match.ticketInfo?.available ? match.ticketInfo.price : "Sold Out"}</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs for detailed analysis */}
			<Tabs className="space-y-6" defaultValue="head-to-head">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="head-to-head">Head-to-Head</TabsTrigger>
					<TabsTrigger value="form1">Sarah&#39;s Form</TabsTrigger>
					<TabsTrigger value="form2">John&#39;s Form</TabsTrigger>
				</TabsList>

				<TabsContent value="head-to-head">
					<HeadToHeadHistory headToHead={match.headToHead} />
				</TabsContent>

				<TabsContent value="form1">
					<RecentForm title="Sarah Johnson" player={match.player1} />
				</TabsContent>

				<TabsContent value="form2">
					<RecentForm title="John Smith" player={match.player2} />
				</TabsContent>
			</Tabs>

			{/* Action Buttons */}
			{match.status === "scheduled" && (
				<div className="flex justify-center gap-4">
					{match.broadcastInfo?.streamUrl && (
						<Button asChild>
							<Link href={match.broadcastInfo.streamUrl}>Watch Live Stream</Link>
						</Button>
					)}
					{match.ticketInfo?.available && match.ticketInfo.url && (
						<Button asChild variant="outline">
							<Link href={match.ticketInfo.url}>Buy Tickets</Link>
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
