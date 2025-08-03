"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Users, Award, Crown, Medal, Gauge, Trophy, Target, TrendingUp, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { formatRatio } from "@/utils/strings";
import { Match, ISOTime, CompletedMatch, type PlayerStat, type WithScheduled, DefinedPlayersMatch, type PlayerAchievement } from "@/interfaces";

function RecentMatches({ matches, playerId }: { playerId: string; matches: CompletedMatch[] }) {
	const router = useRouter();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Matches</CardTitle>
				<CardDescription>Latest match results across all tournaments</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[30px]">ID</TableHead>
							<TableHead className="w-[180px]">Date</TableHead>
							<TableHead className="w-[140px] text-center">Type</TableHead>
							<TableHead>Opponent</TableHead>
							<TableHead className="text-center">Score</TableHead>
							<TableHead className="text-center">Result</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{matches.map((match) => (
							<TableRow key={match.id} className="cursor-pointer hover:bg-muted" onClick={() => router.push(`/matches/${match.id}`)}>
								<TableCell className="font-mono text-sm">{Match.formatId(match)}</TableCell>
								<TableCell className="font-mono text-sm">{ISOTime.formatDate(match.scheduledAt)}</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline" className="text-xs">
										{match.name}
									</Badge>
								</TableCell>
								<TableCell>
									<PlayerDisplay
										player={{ id: DefinedPlayersMatch.getOpponentId(match, playerId), name: DefinedPlayersMatch.getOpponentName(match, playerId) }}
									/>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="outline" className="font-mono">
										{CompletedMatch.isWinner(match, playerId)
											? `${CompletedMatch.getWinnerRacksWon(match)} - ${CompletedMatch.getLoserRacksWon(match)}`
											: `${CompletedMatch.getLoserRacksWon(match)} - ${CompletedMatch.getWinnerRacksWon(match)}`}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant={CompletedMatch.isWinner(match, playerId) ? "default" : "secondary"}
										className={CompletedMatch.isWinner(match, playerId) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
										{CompletedMatch.isWinner(match, playerId) ? "Win" : "Loss"}
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

function PlayerAchievements({ achievements }: { achievements: PlayerAchievement[] }) {
	const getIcon = (iconName: string | undefined) => {
		switch (iconName) {
			case "crown":
				return <Crown className="h-5 w-5 text-yellow-600" />;
			case "trophy":
				return <Trophy className="h-5 w-5 text-blue-600" />;
			case "medal":
				return <Medal className="h-5 w-5 text-blue-600" />;
			case "target":
				return <Target className="h-5 w-5 text-green-600" />;
			case "award":
				return <Award className="h-5 w-5 text-purple-600" />;
			case "star":
				return <Star className="h-5 w-5 text-orange-600" />;
			case "users":
				return <Users className="h-5 w-5 text-orange-600" />;
			case "shield-check":
				return <ShieldCheck className="h-5 w-5 text-green-600" />;
			default:
				return <Award className="h-5 w-5 text-gray-600" />;
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Achievements</CardTitle>
				<CardDescription>Major accomplishments and milestones</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{achievements.map((achievement, index) => (
						<div key={index} className="flex items-start gap-3 rounded-lg border p-3">
							<div className="rounded-lg bg-gray-50 p-2">{getIcon(achievement.icon)}</div>
							<div className="flex-1">
								<h4 className="font-semibold">{achievement.title}</h4>
								<p className="text-sm text-muted-foreground">{achievement.description}</p>
								<div className="mt-1 flex items-center gap-2">
									<p className="text-xs text-muted-foreground">{achievement.tournamentName}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function PlayerPage({
	playerStat,
	upcomingMatches
}: {
	playerStat: PlayerStat;
	upcomingMatches: WithScheduled<DefinedPlayersMatch & { winChance: number }>[];
}) {
	const router = useRouter();

	return (
		<PageContainer items={[Links.Players.get(), Links.Players.Player.get(playerStat.id, playerStat.name)]}>
			{/* Player Header */}
			<div className="mb-8 flex items-center gap-6">
				<div className="flex-1">
					<div className="mb-1 flex items-center gap-3">
						<h1 className="text-2xl font-bold">{playerStat.name}</h1>
						<Badge variant="outline">#{playerStat.rank}</Badge>
					</div>

					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1">{playerStat.nickname}</div>
					</div>
				</div>
			</div>

			{/* Performance Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Overview</CardTitle>
					<CardDescription>Overall performance metrics across all tournaments</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-2">
									<div className="rounded-lg bg-blue-100 p-2">
										<Gauge className="h-4 w-4 text-blue-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{isNaN(playerStat.eloRating) ? "-" : playerStat.eloRating.toFixed(0)}</p>
										<Link href="/faq#how-a-players-elo-rating-is-calculated" className="text-xs text-muted-foreground underline">
											Elo rating
										</Link>
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
										<p className="text-2xl font-bold">{formatRatio(playerStat.matchWinRate)}</p>
										<p className="text-xs text-muted-foreground">Match Win Rate</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-2">
									<div className="rounded-lg bg-yellow-100 p-2">
										<Crown className="h-4 w-4 text-yellow-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{formatRatio(playerStat.racksWinRate)}</p>
										<p className="text-xs text-muted-foreground">Rack Win Rate</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-2">
									<div className="rounded-lg bg-purple-100 p-2">
										<TrendingUp className="h-4 w-4 text-purple-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{playerStat.maxStreak}</p>
										<p className="text-xs text-muted-foreground">Max Streak</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-2 gap-4 border-t pt-4 text-center md:grid-cols-4">
						<div>
							<p className="text-2xl font-bold text-yellow-600">{playerStat.championships}</p>
							<p className="text-sm text-muted-foreground">Championships</p>
						</div>
						<div>
							<p className="text-2xl font-bold text-gray-600">{playerStat.runnerUps}</p>
							<p className="text-sm text-muted-foreground">Runner-ups</p>
						</div>
						<div>
							<p className="text-2xl font-bold text-blue-600">{playerStat.semiFinals}</p>
							<p className="text-sm text-muted-foreground">Semi-finals</p>
						</div>
						<div>
							<p className="text-2xl font-bold text-purple-600">{playerStat.quarterFinals}</p>
							<p className="text-sm text-muted-foreground">Quarter-finals</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<PlayerAchievements achievements={playerStat.achievements} />

			{upcomingMatches?.length && (
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Matches</CardTitle>
						<CardDescription>Next matches scheduled for this player</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[30px]">ID</TableHead>
									<TableHead className="w-[180px]">Date</TableHead>
									<TableHead className="w-[140px] text-center">Type</TableHead>
									<TableHead>Opponent</TableHead>
									<TableHead className="text-center">Win Chance %</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{upcomingMatches.map((match) => {
									const opponentId = DefinedPlayersMatch.getOpponentId(match, playerStat.id);

									return (
										<TableRow key={match.id} className="cursor-pointer hover:bg-muted" onClick={() => router.push(`/matches/${match.id}`)}>
											<TableCell className="text-center font-mono">{Match.formatId(match)}</TableCell>
											<TableCell className="font-mono text-sm">{ISOTime.formatDate(match.scheduledAt)}</TableCell>
											<TableCell className="text-center">
												<Badge variant="outline" className="text-xs">
													{match.name}
												</Badge>
											</TableCell>
											<TableCell>
												<PlayerDisplay player={{ id: opponentId, name: DefinedPlayersMatch.getOpponentName(match, playerStat.id) }} />
											</TableCell>

											<TableCell className="text-center">{formatRatio(match.winChance)}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}

			<RecentMatches playerId={playerStat.id} matches={playerStat.recentMatches} />
		</PageContainer>
	);
}
