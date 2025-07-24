import { notFound } from "next/navigation";
import { Trophy, Target, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { toLabel, getStatusColor } from "@/utils/strings";
import { formatDate, formatTime } from "@/utils/date-time";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { Match, CompletedMatch, ScheduledMatch, type GroupMatch, DefinedPlayersMatch } from "@/interfaces";

interface Props {
	params: Promise<{ year: string; groupId: string }>;
}

export default async function GroupPage({ params }: Props) {
	const { year, groupId } = await params;
	const group = await new GroupRepository().find({ year, groupId });

	if (!group) {
		return notFound();
	}

	const players = await new PlayerRepository().getAll();
	const getPlayerName = (playerId: string | undefined) => {
		if (!playerId) {
			return "TBD";
		}

		const player = players.find((p) => p.id === playerId);

		if (!player) {
			throw new Error(`Player with ID ${playerId} not found`);
		}

		return player.name;
	};

	const matches = await new MatchRepository().getAllMatchesByGroup({ year, groupId });

	const standings = await new GroupRepository().getStandings({ year, groupId });

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Trophy className="h-8 w-8 text-primary" />
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
					<p className="text-muted-foreground">Tournament Year {year}</p>
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
							</TableRow>
						</TableHeader>
						<TableBody>
							{standings.map((standing, index) => (
								<TableRow key={standing.playerId}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Badge variant={index === 0 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
												{index + 1}
											</Badge>
											{getPlayerName(standing.playerId)}
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
								<TableHead className="w-[120px]">Date</TableHead>
								<TableHead className="w-[120px]">Time</TableHead>
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
									<TableRow key={match.id}>
										<TableCell className="font-mono text-sm">
											{ScheduledMatch.isInstance(match) ? formatDate(match.scheduledAt.date, { month: "short", day: "numeric" }) : "-"}
										</TableCell>
										<TableCell className="font-mono text-sm">{ScheduledMatch.isInstance(match) ? formatTime(match.scheduledAt.time) : "-"}</TableCell>
										<TableCell>
											<div className="flex items-center">
												{getPlayerName(match.player1Id)}
												{getWinnerBadge(match, true)}
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
											<div className="flex items-center">
												{getPlayerName(match.player2Id)}
												{getWinnerBadge(match, false)}
											</div>
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

const getWinnerBadge = (match: GroupMatch, isPlayer1: boolean) => {
	const winnerId = DefinedPlayersMatch.isInstance(match) && CompletedMatch.isInstance(match) ? CompletedMatch.getWinnerId(match) : undefined;

	if (winnerId === undefined) {
		return null;
	}

	if ((isPlayer1 && winnerId === match.player1Id) || (!isPlayer1 && winnerId === match.player2Id)) {
		return (
			<Badge className="ml-2" variant="default">
				W
			</Badge>
		);
	}

	return (
		<Badge className="ml-2" variant="secondary">
			L
		</Badge>
	);
};
