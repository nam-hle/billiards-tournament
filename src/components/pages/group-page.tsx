"use client";

import Link from "next/link";
import React, { use, Suspense } from "react";
import { Target, Calendar, CircleQuestionMark } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Separator } from "@/components/shadcn/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/shadcn/tooltip";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

import { PlayerDisplay } from "@/components/player-display";
import { SuspendableTable } from "@/components/suspendable-table";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { toLabel, formatRatio, getStatusColor } from "@/utils/strings";
import type { GroupPrediction } from "@/interfaces/prediction.interface";
import { Match, ISOTime, CompletedMatch, type Tournament, type GroupMatch, type GroupStanding, DefinedPlayersMatch } from "@/interfaces";

export function GroupPage(props: {
	groupName: string;
	matches: Promise<GroupMatch[]>;
	tournament: Promise<Tournament>;
	standings: Promise<GroupStanding[]>;
	predictions: Promise<GroupPrediction>;
	advancedPlayers: Promise<GroupStanding[]>;
}) {
	const { matches, groupName, standings } = props;

	const tournament = use(props.tournament);

	return (
		<PageContainer
			items={[
				Links.Tournaments.get(),
				Links.Tournaments.Tournament.get(tournament.id, tournament.name),
				Links.Tournaments.Tournament.Groups.get(tournament.id),
				Links.Tournaments.Tournament.Groups.Group.get(tournament.id, groupName)
			]}>
			{/* Header */}
			<div className="flex items-center gap-3">
				<Target className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{`Group ${groupName}`}</h1>
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
					<SuspendableTable
						data={standings}
						dataKeyGetter={({ row }) => row.player.id}
						hrefGetter={({ row }) => `/players/${row.player.id}`}
						isHighlighted={({ row }) =>
							use(props.advancedPlayers)
								.map((standing) => standing.player.id)
								.includes(row.player.id)
						}
						columns={[
							{
								width: 200,
								label: "Players",
								dataGetter: ({ row, rowIndex }) => (
									<div className="flex items-center gap-2">
										<Badge variant={rowIndex === 0 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
											{rowIndex + 1}
										</Badge>
										<PlayerDisplay showAvatar={false} player={row.player} />
									</div>
								)
							},
							{ label: "Played", alignment: "center", dataGetter: ({ row }) => row.completedMatches.length },
							{
								label: "Wins",
								alignment: "center",
								dataGetter: ({ row }) => (
									<Badge variant="secondary" className="bg-green-100 text-green-800">
										{row.matchWins}
									</Badge>
								)
							},
							{
								label: "Losses",
								alignment: "center",
								dataGetter: ({ row }) => (
									<Badge variant="secondary" className="bg-red-100 text-red-800">
										{row.matchLosses}
									</Badge>
								)
							},
							{
								label: "Racks Won",
								alignment: "center",
								dataGetter: ({ row }) => (
									<Badge variant="secondary" className="bg-green-100 text-green-800">
										{row.rackWins}
									</Badge>
								)
							},
							{
								label: "Racks Lost",
								alignment: "center",
								dataGetter: ({ row }) => (
									<Badge variant="secondary" className="bg-red-100 text-red-800">
										{row.rackLosses}
									</Badge>
								)
							},
							{
								label: "Racks Diff",
								alignment: "center",
								dataGetter: ({ row }) => (
									<Badge
										variant="secondary"
										className={{ "0": "", "-1": "bg-red-100 text-red-800", "1": "bg-green-100 text-green-800" }[Math.sign(row.racksDifference)]}>
										{row.racksDifference}
									</Badge>
								)
							},
							{
								label: "Points",
								alignment: "center",
								dataGetter: ({ row }) => (
									<Badge variant="default" className="font-semibold">
										{row.points}
									</Badge>
								)
							},
							{
								label: "Form",
								dataGetter: ({ row }) => (
									<div className="flex justify-start gap-1">
										{row.completedMatches.map((completedMatch) => {
											const opponentName = DefinedPlayersMatch.getOpponent(completedMatch, row.player.id);
											const isWin = CompletedMatch.isWinner(completedMatch, row.player.id);

											return (
												<Link key={completedMatch.id} href={`/matches/${completedMatch.id}`}>
													<div
														className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isWin ? "bg-green-400" : "bg-red-400"}`}
														title={
															isWin
																? `Won vs ${opponentName}, score ${CompletedMatch.getWinnerRackWins(completedMatch)}-${CompletedMatch.getLoserRackWins(completedMatch)}`
																: `Lost to ${opponentName}, score ${CompletedMatch.getLoserRackWins(completedMatch)}-${CompletedMatch.getWinnerRackWins(completedMatch)}`
														}></div>
												</Link>
											);
										})}
									</div>
								)
							},
							{
								alignment: "center",
								key: "probabilities",
								dataGetter: ({ row }) => (
									<Suspense fallback={<Skeleton className="h-8 w-full" />}>
										<PredictionOutput playerId={row.player.id} predictions={props.predictions} />
									</Suspense>
								),
								label: (
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
								)
							}
						]}
					/>

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
					<SuspendableTable
						data={matches}
						expectedNumberOfRows={10}
						dataKeyGetter={({ row }) => row.id}
						rowClassName="cursor-pointer hover:bg-muted"
						hrefGetter={({ row }) => `/matches/${row.id}`}
						columns={[
							{
								width: 50,
								label: "ID",
								className: "font-mono text-sm",
								dataGetter: ({ row }) => Match.formatId(row)
							},
							{
								width: 140,
								label: "Date",
								className: "font-mono text-sm",
								dataGetter: ({ row }) => ISOTime.formatDate(row.scheduledAt, { year: undefined })
							},
							{
								width: 140,
								label: "Time",
								className: "font-mono text-sm",
								dataGetter: ({ row }) => ISOTime.formatTime(row.scheduledAt)
							},
							{
								label: "Player 1",
								alignment: "right",
								dataGetter: ({ row }) => (
									<PlayerDisplay
										showAvatar={false}
										containerClassName="justify-end"
										player={DefinedPlayersMatch.isInstance(row) ? row.player1 : undefined}
										highlight={CompletedMatch.isInstance(row) && CompletedMatch.isWinner(row, row.player1.id)}
									/>
								)
							},
							{
								label: "Score",
								dataGetter: ({ row }) =>
									row.score1 != null && row.score2 != null ? (
										<Badge variant="outline" className="font-mono">
											{row.score1} : {row.score2}
										</Badge>
									) : (
										<span className="text-muted-foreground">-</span>
									)
							},
							{
								label: "Player 2",
								alignment: "left",
								dataGetter: ({ row }) => (
									<PlayerDisplay
										showAvatar={false}
										player={DefinedPlayersMatch.isInstance(row) ? row.player2 : undefined}
										highlight={CompletedMatch.isInstance(row) && CompletedMatch.isWinner(row, row.player2.id)}
									/>
								)
							},
							{
								label: "Status",
								dataGetter: ({ row }) => <Badge className={getStatusColor(Match.getStatus(row))}>{toLabel(Match.getStatus(row))}</Badge>
							}
						]}
					/>
				</CardContent>
			</Card>
		</PageContainer>
	);
}

const PredictionOutput: React.FC<{ playerId: string; predictions: Promise<GroupPrediction> }> = (props) => {
	const prediction = use(props.predictions);

	return (
		<>
			{formatRatio(prediction.top1[props.playerId])} / {formatRatio(prediction.top2[props.playerId])}
		</>
	);
};
