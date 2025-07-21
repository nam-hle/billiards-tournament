import { notFound } from "next/navigation";
import { Trophy, Target, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { Match } from "@/interfaces";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";

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
	const getPlayerName = (playerId: string) => {
		const player = players.find((p) => p.id === playerId);

		return player ? player.name : "Unknown Player";
	};

	const getMatchStatus = (score1: number | undefined, score2: number | undefined) => {
		if (score1 !== undefined && score2 !== undefined) {
			return "completed";
		}

		return "scheduled";
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
								<TableHead>Player 1</TableHead>
								<TableHead className="w-[120px] text-center">Score</TableHead>
								<TableHead>Player 2</TableHead>
								<TableHead className="w-[100px] text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{matches.map((match) => {
								const status = getMatchStatus(match.score1, match.score2);

								return (
									<TableRow key={match.id}>
										<TableCell className="font-mono text-sm">
											{match.scheduledAt ? new Date(match.scheduledAt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
										</TableCell>
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
											<Badge
												variant={status === "completed" ? "default" : "secondary"}
												className={status === "completed" ? "bg-green-100 text-green-800" : ""}>
												{status === "completed" ? "Completed" : "Scheduled"}
											</Badge>
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

const getWinnerBadge = (match: Match, isPlayer1: boolean) => {
	const winnerId = Match.getWinnerId(match);

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
