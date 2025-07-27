"use client";

import React from "react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { Target, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

import { Links } from "@/utils/links";
import { formatDateTime } from "@/utils/date-time";
import { toLabel, formatRatio, getStatusColor } from "@/utils/strings";
import {
	Match,
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
		<div className="container mx-auto space-y-8 py-8">
			<PageBreadcrumb
				items={[
					Links.Tournaments.get(),
					Links.Tournaments.Year.get(year, tournament.name),
					Links.Tournaments.Year.Groups.get(year),
					Links.Tournaments.Year.Groups.Group.get(year, groupId, group.name)
				]}
			/>

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
								<TableHead className="text-center font-semibold">Top 1 Probability</TableHead>
								<TableHead className="text-center font-semibold">Top 2 Probability</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{standings.map((standing, index) => (
								<TableRow
									key={standing.playerId}
									className={clsx({
										"bg-blue-100 transition-colors hover:bg-blue-200": advancedPlayerIds.includes(standing.playerId)
									})}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Badge variant={index === 0 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
												{index + 1}
											</Badge>
											<PlayerDisplay showAvatar={false} player={{ id: standing.playerId, name: standing.playerName }} />
										</div>
									</TableCell>
									<TableCell className="text-center">{standing.played}</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{standing.wins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{standing.losses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{standing.matchesWins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{standing.matchesLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="secondary"
											className={
												{ "0": "", "-1": "bg-red-100 text-red-800", "1": "bg-green-100 text-green-800" }[
													Math.sign(standing.matchesWins - standing.matchesLosses)
												]
											}>
											{standing.matchesWins - standing.matchesLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="default" className="font-semibold">
											{standing.points}
										</Badge>
									</TableCell>
									<TableCell className="text-center">{formatRatio(standing.top1Prob)}</TableCell>
									<TableCell className="text-center">{formatRatio(standing.top2Prob)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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
								<TableHead className="w-[200px]">Time</TableHead>
								<TableHead>Player 1</TableHead>
								<TableHead className="w-[120px] text-center">Score</TableHead>
								<TableHead>Player 2</TableHead>
								<TableHead className="w-[100px] text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{matches.map((match) => {
								const status = Match.getStatus(match);

								return (
									<TableRow
										key={match.id}
										className="cursor-pointer hover:bg-muted"
										onClick={() => router.push(Links.Matches.Match.get(match.id).href)}>
										<TableCell className="font-mono text-sm">{Match.formatId(match)}</TableCell>
										<TableCell className="font-mono text-sm">{ScheduledMatch.isInstance(match) ? formatDateTime(match.scheduledAt) : "-"}</TableCell>
										<TableCell>
											<PlayerDisplay
												showAvatar={false}
												highlight={CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player1Id}
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
												highlight={CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player2Id}
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
		</div>
	);
}
