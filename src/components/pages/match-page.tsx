"use client";

import React from "react";
import Link from "next/link";
import { Zap, Clock, MapPin, Trophy, History, Percent, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Progress } from "@/components/shadcn/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/shadcn/tooltip";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { CountdownTimer } from "@/components/countdown-timer";
import { getRandomGradient } from "@/components/player-display";
import { PageContainer } from "@/components/layouts/page-container";

import { cn } from "@/utils/cn";
import { Links } from "@/utils/links";
import { toLabel, formatRatio, getAbbrName, getStatusColor } from "@/utils/strings";
import {
	Match,
	ISOTime,
	type Player,
	ScheduledMatch,
	CompletedMatch,
	type MatchDetails,
	DefinedPlayersMatch,
	type PlayerOverallStat
} from "@/interfaces";

function MatchResult({ match }: { match: MatchDetails }) {
	if (!CompletedMatch.isInstance(match) || !match.player1Stat || !match.player2Stat) {
		return null;
	}

	const winner = CompletedMatch.isWinner(match, match.player1Stat.id) ? match.player1Stat : match.player2Stat;

	return (
		<Card className="border-green-200 bg-gradient-to-r from-green-50 to-green-100">
			<CardContent className="pt-6">
				<div className="space-y-6 text-center">
					{/* Winner Announcement */}
					<div className="space-y-2">
						<div className="flex items-center justify-center gap-2">
							<Trophy className="h-6 w-6 text-yellow-600" />
							<h2 className="text-2xl font-bold text-green-800">Match Result</h2>
							<Trophy className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="text-lg text-green-700">
							<span className="font-bold">{winner.name}</span> wins the match!
						</div>
					</div>

					{/* Final Score */}
					<div className="flex items-center justify-center gap-8">
						<Link href={`/players/${match.player1.id}`}>
							<div className="text-center">
								<Avatar className="mx-auto mb-2 h-16 w-16">
									<AvatarImage alt={match.player1Stat.name} />
									<AvatarFallback className={getRandomGradient(match.player1.name)}>{getAbbrName(match.player1Stat.name)}</AvatarFallback>
								</Avatar>
								<div className="font-medium">{match.player1Stat.name}</div>
							</div>
						</Link>

						<div className="text-center">
							<div className="mb-2 text-4xl font-bold">
								<span className={winner.id === match.player1Stat.id ? "text-green-600" : "text-gray-600"}>{match.score1}</span>
								<span className="mx-2 text-gray-400">-</span>
								<span className={winner.id === match.player2Stat.id ? "text-green-600" : "text-gray-600"}>{match.score2}</span>
							</div>
							<Badge variant="outline" className="text-sm">
								Final Score
							</Badge>
						</div>

						<Link href={`/players/${match.player2.id}`}>
							<div className="text-center">
								<Avatar className="mx-auto mb-2 h-16 w-16">
									<AvatarImage alt={match.player2Stat.name} />
									<AvatarFallback className={getRandomGradient(match.player2.name)}>{getAbbrName(match.player2.name)}</AvatarFallback>
								</Avatar>
								<div className="font-medium">{match.player2Stat.name}</div>
							</div>
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function PlayerCard({ player, isWinner }: { isWinner?: boolean; isPlayer1?: boolean; player: PlayerOverallStat }) {
	return (
		<Card className={isWinner ? "bg-green-50 ring-2 ring-green-400" : ""}>
			<CardContent className="pt-6">
				<div className="space-y-4 text-center">
					{isWinner && (
						<div className="mb-2 flex items-center justify-center gap-1">
							<Trophy className="h-4 w-4 text-yellow-600" />
							<Badge className="bg-green-100 text-green-800">Winner</Badge>
						</div>
					)}

					<p className={cn("text-lg font-medium")}>{player.name}</p>

					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="text-lg font-bold">{player.matchWins}</div>
							<div className="text-xs text-muted-foreground">Wins</div>
						</div>
						<div>
							<div className="text-lg font-bold">{player.matchLosses}</div>
							<div className="text-xs text-muted-foreground">Losses</div>
						</div>
						<div>
							<div className="text-lg font-bold">{formatRatio(player.matchWinRate)}</div>
							<div className="text-xs text-muted-foreground">Win Rate</div>
						</div>
					</div>

					<div>
						<div className="mb-2 text-sm font-medium">Current Form</div>
						<div className="flex justify-center gap-1">
							{player.recentMatches.sort(ScheduledMatch.ascendingComparator).map((match) => (
								<div
									key={match.id}
									className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
										CompletedMatch.isWinner(match, player.id) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
									}`}>
									{CompletedMatch.isWinner(match, player.id) ? "W" : "L"}
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function WinPrediction(props: { match: MatchDetails }) {
	const { player1, player2, prediction, player1Stat, player2Stat } = props.match;

	if (!prediction || !player1 || !player2 || !player1Stat || !player2Stat) {
		return null;
	}

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
							<span>{player1.name}</span>
							<span className="font-bold">{formatRatio(prediction.player1WinChance)}</span>
						</div>
						<Progress className="h-3" value={prediction.player1WinChance * 100} />
					</div>
					<div>
						<div className="mb-2 flex justify-between text-sm">
							<span>{player2.name}</span>
							<span className="font-bold">{formatRatio(prediction.player2WinChance)}</span>
						</div>
						<Progress className="h-3" value={prediction.player2WinChance * 100} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function HeadToHeadHistory(props: { player2: Player; player1: Player; headToHeadMatches?: CompletedMatch[] }) {
	const { player1, player2, headToHeadMatches } = props;
	const lastMatch: CompletedMatch | undefined = headToHeadMatches?.[0];
	const player1Wins = headToHeadMatches?.filter((match) => CompletedMatch.isWinner(match, player1.id)).length ?? 0;
	const player2Wins = headToHeadMatches?.filter((match) => CompletedMatch.isWinner(match, player2.id)).length ?? 0;

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
				{!headToHeadMatches?.length ? (
					<div className="py-12 text-center">
						<h3 className="mb-2 text-lg font-semibold">No data found</h3>
					</div>
				) : (
					<div className="text-center">
						<div className="mb-2 text-3xl font-bold">
							{player1Wins} - {player2Wins}
						</div>
						<div className="text-sm text-muted-foreground">
							{player1Wins != player2Wins
								? `${player1Wins > player2Wins ? player1.name : player2.name} leads the series (${headToHeadMatches.length} matches played)`
								: `They share results (${headToHeadMatches.length} matches played)`}
						</div>
					</div>
				)}

				{lastMatch && (
					<div className="border-t pt-4">
						<h4 className="mb-3 font-medium">Last Match</h4>
						<div className="rounded-lg bg-gray-50 p-3">
							<div className="mb-2 flex items-center justify-between">
								<span className="font-medium">{lastMatch.tournament.name}</span>
								<Badge variant="outline">{`${lastMatch.score1}-${lastMatch.score2}`}</Badge>
							</div>
							<div className="text-sm text-muted-foreground">
								{CompletedMatch.getWinner(lastMatch).name} won • {ISOTime.formatDate(lastMatch.scheduledAt, { weekday: undefined })}
							</div>
						</div>
					</div>
				)}

				{!!headToHeadMatches?.length && (
					<div className="border-t pt-4">
						<h4 className="mb-3 font-medium">Recent Results</h4>
						<div className="space-y-2">
							{headToHeadMatches.map((match, index) => (
								<div key={index} className="flex items-center justify-between border-b py-2 last:border-b-0">
									<div>
										<div className="font-medium">{CompletedMatch.getWinnerId(match) === player1.id ? player1.name : player2.name}</div>
										<div className="text-xs text-muted-foreground">{match.tournament.name}</div>
									</div>
									<div className="text-right">
										<Badge className="mb-1" variant="outline">
											{`${match.score1}-${match.score2}`}
										</Badge>
										<div className="text-xs text-muted-foreground">{ISOTime.formatDate(match.scheduledAt, { weekday: undefined })}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function RecentForm({ player }: { player: PlayerOverallStat }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{player.name} - Recent Form</CardTitle>
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
						{player.recentMatches.slice(0, 5).map((match, index) => (
							<TableRow key={index}>
								<TableCell className="font-mono text-sm">{ISOTime.formatDate(match.scheduledAt, { weekday: undefined })}</TableCell>
								<TableCell className="font-medium">{DefinedPlayersMatch.getOpponent(match, player.id).name}</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline" className="font-mono">
										{`${match.score1} - ${match.score2}`}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant={CompletedMatch.isWinner(match, player.id) ? "default" : "secondary"}
										className={CompletedMatch.isWinner(match, player.id) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
										{CompletedMatch.isWinner(match, player.id) ? "Win" : "Loss"}
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
		readonly matchDetails: MatchDetails;
	}
}

export const MatchDetailsPage = ({ matchDetails }: MatchDetailsPage.Props) => {
	const isPending = !CompletedMatch.isInstance(matchDetails);

	return (
		<PageContainer items={[Links.Matches.get(), Links.Matches.Match.get(matchDetails.id)]}>
			{/* Match Header */}
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-4 text-center">
						<div className="flex items-center justify-center space-x-2">
							<h1 className="text-2xl font-bold">Match {Match.formatId(matchDetails)}</h1>
						</div>

						<div className="flex justify-center gap-2 text-sm">
							<Badge variant="outline">{matchDetails.tournament.name}</Badge>
							<Badge variant="outline">{Match.getName(matchDetails)}</Badge>
							<Badge className={getStatusColor(Match.getStatus(matchDetails))}>{toLabel(Match.getStatus(matchDetails))}</Badge>
						</div>

						<div className="flex justify-center gap-8 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								{ISOTime.formatDate(matchDetails.scheduledAt)}
							</div>
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								{ISOTime.formatTime(matchDetails.scheduledAt)}
							</div>
							<div className="flex items-center gap-1">
								<MapPin className="h-4 w-4" />
								{matchDetails.tournament.googleMapsUrl ? (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<a target="_blank" rel="noopener noreferrer" href={matchDetails.tournament.googleMapsUrl}>
													{matchDetails.tournament.venue}
												</a>
											</TooltipTrigger>
											<TooltipContent>
												<p>Click to open in Google Maps</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								) : (
									<span>{matchDetails.tournament.venue}</span>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<MatchResult match={matchDetails} />

			{/* Countdown Timer */}
			{ScheduledMatch.isInstance(matchDetails) && Match.getStatus(matchDetails) === "upcoming" && (
				<Card className="space-y-8 border-none py-8">
					<CardHeader>
						<CardTitle className="flex items-center justify-center gap-2 text-center text-2xl">
							<Zap className="h-5 w-5" />
							Match Starts In
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CountdownTimer targetTime={matchDetails.scheduledAt} />
					</CardContent>
				</Card>
			)}

			{matchDetails.player1Stat && matchDetails.player2Stat && isPending && (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<PlayerCard
						isPlayer1
						player={matchDetails.player1Stat}
						isWinner={CompletedMatch.isInstance(matchDetails) && CompletedMatch.isWinner(matchDetails, matchDetails.player1Stat.id)}
					/>
					<PlayerCard
						isPlayer1={false}
						player={matchDetails.player2Stat}
						isWinner={CompletedMatch.isInstance(matchDetails) && CompletedMatch.isWinner(matchDetails, matchDetails.player2Stat.id)}
					/>
				</div>
			)}

			{isPending && <WinPrediction match={matchDetails} />}

			{isPending && matchDetails.player1Stat && matchDetails.player2Stat && (
				<Tabs className="space-y-6" defaultValue="head-to-head">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="form1">{matchDetails.player1Stat.name}</TabsTrigger>
						<TabsTrigger value="head-to-head">Head-to-Head</TabsTrigger>
						<TabsTrigger value="form2">{matchDetails.player2Stat.name}</TabsTrigger>
					</TabsList>

					<TabsContent value="form1">
						<RecentForm player={matchDetails.player1Stat} />
					</TabsContent>

					<TabsContent value="head-to-head">
						<HeadToHeadHistory
							player2={matchDetails.player2Stat}
							player1={matchDetails.player1Stat}
							headToHeadMatches={matchDetails.headToHeadMatches}
						/>
					</TabsContent>

					<TabsContent value="form2">
						<RecentForm player={matchDetails.player2Stat} />
					</TabsContent>
				</Tabs>
			)}
		</PageContainer>
	);
};
