"use client";

import React from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Target, Calendar, CircleQuestionMark } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { toLabel, formatRatio, getStatusColor } from "@/utils/strings";
import {
	Match,
	ISOTime,
	type Group,
	CompletedMatch,
	ScheduledMatch,
	type Tournament,
	type GroupMatch,
	type GroupStanding,
	DefinedPlayersMatch
} from "@/interfaces";

export function GroupPage(props: {
	group: Group;
	matches: GroupMatch[];
	tournament: Tournament;
	standings: GroupStanding[];
	advancedPlayerIds: string[];
}) {
	const { group, matches, standings, tournament, advancedPlayerIds } = props;
	const { year } = tournament;
	const groupId = group.id;

	const router = useRouter();

	return (
		<PageContainer
			items={[
				Links.Tournaments.get(),
				Links.Tournaments.Year.get(year, tournament.name),
				Links.Tournaments.Year.Groups.get(year),
				Links.Tournaments.Year.Groups.Group.get(year, groupId)
			]}>
			{/* Header */}
			<div className="flex items-center gap-3">
				<Target className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
					<p className="text-muted-foreground">{tournament.name}</p>
				</div>
			</div>

			<Separator />

			{/* Standings Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						Standings
					</CardTitle>
					<CardDescription>Current group standings and player statistics</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[200px]">Player</TableHead>
								<TableHead className="text-center">Played</TableHead>
								<TableHead className="text-center">Wins</TableHead>
								<TableHead className="text-center">Losses</TableHead>
								<TableHead className="text-center">Racks Won</TableHead>
								<TableHead className="text-center">Racks Lost</TableHead>
								<TableHead className="text-center">Racks Diff</TableHead>
								<TableHead className="text-center font-semibold">Points</TableHead>
								<TableHead className="text-center font-semibold">Form</TableHead>
								<TableHead className="text-center font-semibold">
									<div className="flex items-center justify-center gap-1">
										Advance Probabilities
										<Tooltip>
											<TooltipTrigger>
												<CircleQuestionMark className="h-5 w-5" />
											</TooltipTrigger>
											<TooltipContent className="text-muted-foreground">
												Estimated top 1/top 2 finish probabilities based on completed match results and simulations of remaining matches using current
												ratings
											</TooltipContent>
										</Tooltip>
									</div>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{standings.map((standing, index) => (
								<TableRow
									key={standing.playerId}
									className={clsx({
										"bg-secondary/95 transition-colors": advancedPlayerIds.includes(standing.playerId)
									})}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Badge variant={index === 0 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
												{index + 1}
											</Badge>
											<PlayerDisplay showAvatar={false} player={{ id: standing.playerId, name: standing.playerName }} />
										</div>
									</TableCell>
									<TableCell className="text-center">{standing.completedMatches.length}</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{standing.matchWins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{standing.matchLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{standing.rackWins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{standing.rackLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="secondary"
											className={
												{ "0": "", "-1": "bg-red-100 text-red-800", "1": "bg-green-100 text-green-800" }[
													Math.sign(standing.rackWins - standing.rackLosses)
												]
											}>
											{standing.rackWins - standing.rackLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="default" className="font-semibold">
											{standing.points}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex justify-center gap-1">
											{standing.completedMatches.map((completedMatch) => {
												const opponentName = CompletedMatch.getOpponentName(completedMatch, standing.playerId);
												const isWin = CompletedMatch.isWinner(completedMatch, standing.playerId);

												return (
													<Link key={completedMatch.id} href={`/matches/${completedMatch.id}`}>
														<div
															className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isWin ? "bg-green-400" : "bg-red-400"}`}
															title={
																isWin
																	? `Won vs ${opponentName}, score ${CompletedMatch.getWinnerRacksWon(completedMatch)}-${CompletedMatch.getLoserRacksWon(completedMatch)}`
																	: `Lost to ${opponentName}, score ${CompletedMatch.getLoserRacksWon(completedMatch)}-${CompletedMatch.getWinnerRacksWon(completedMatch)}`
															}></div>
													</Link>
												);
											})}
										</div>
									</TableCell>
									<TableCell className="text-center">
										{formatRatio(standing.top1Prob)} / {formatRatio(standing.top2Prob)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					<CardDescription className="mt-3">(*) Highlighted players are expected to advance to the quarter-final stage</CardDescription>
				</CardContent>
			</Card>

			{/* Matches Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Matches
					</CardTitle>
					<CardDescription>Schedule and results for all group matches</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[50px]">ID</TableHead>
								<TableHead className="w-[140px]">Date</TableHead>
								<TableHead className="w-[140px]">Time</TableHead>
								<TableHead className="text-right">Player 1</TableHead>
								<TableHead className="w-[120px] text-center">Score</TableHead>
								<TableHead>Player 2</TableHead>
								<TableHead className="w-[100px] text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{matches.sort(ScheduledMatch.nullableAscendingComparator).map((match) => {
								const status = Match.getStatus(match);

								return (
									<TableRow key={match.id} className="cursor-pointer hover:bg-muted" onClick={() => router.push(`/matches/${match.id}`)}>
										<TableCell className="font-mono text-sm">{Match.formatId(match)}</TableCell>
										<TableCell className="font-mono text-sm">{ISOTime.formatDate(match.scheduledAt, { year: undefined })}</TableCell>
										<TableCell className="font-mono text-sm">{ISOTime.formatTime(match.scheduledAt)}</TableCell>
										<TableCell>
											<PlayerDisplay
												showAvatar={false}
												containerClassName="justify-end"
												highlight={CompletedMatch.isInstance(match) && CompletedMatch.isWinner(match, match.player1Id)}
												player={DefinedPlayersMatch.isInstance(match) ? { id: match.player1Id, name: match.player1Name } : undefined}
											/>
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
											<PlayerDisplay
												showAvatar={false}
												highlight={CompletedMatch.isInstance(match) && CompletedMatch.isWinner(match, match.player2Id)}
												player={DefinedPlayersMatch.isInstance(match) ? { id: match.player2Id, name: match.player2Name } : undefined}
											/>
										</TableCell>
										<TableCell className="text-center">
											<Badge className={getStatusColor(status)}>{toLabel(status)}</Badge>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</PageContainer>
	);
}
