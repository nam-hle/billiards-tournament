import { Star, Users, Award, Crown, Medal, Trophy, Target, TrendingUp, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";

import { getAbbrName } from "@/utils/strings";
import { formatDate } from "@/utils/date-time";
import { PlayerRepository } from "@/repositories/player.repository";
import { CompletedMatch, DefinedPlayersMatch, type PlayerAchievement } from "@/interfaces";

interface Props {
	params: Promise<{ playerId: string }>;
}

function RecentMatches({ matches, playerId }: { playerId: string; matches: CompletedMatch[] }) {
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
							<TableHead>Date</TableHead>
							{/*<TableHead>Tournament</TableHead>*/}
							<TableHead className="text-center">Stage</TableHead>
							<TableHead>Opponent</TableHead>
							<TableHead className="text-center">Score</TableHead>
							<TableHead className="text-center">Result</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{matches.map((match) => (
							<TableRow key={match.id}>
								<TableCell className="font-mono text-sm">{formatDate(match.scheduledAt.date)}</TableCell>
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
										{`${match.score1} - ${match.score2}`}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant={CompletedMatch.getWinnerId(match) === playerId ? "default" : "secondary"}
										className={CompletedMatch.getWinnerId(match) === playerId ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
										{CompletedMatch.getWinnerId(match) === playerId ? "Win" : "Loss"}
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

export default async function OverallPlayerProfilePage({ params }: Props) {
	const { playerId } = await params;

	const playerStat = await new PlayerRepository().getStat({ playerId });

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Player Header */}
			<div className="mb-8 flex items-center gap-6">
				<Avatar className="h-16 w-16">
					<AvatarImage alt={playerStat.name} />
					<AvatarFallback className="text-xl">{getAbbrName(playerStat.name)}</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<div className="mb-1 flex items-center gap-3">
						<h1 className="text-2xl font-bold">{playerStat.name}</h1>
						<Badge variant="outline">Best Ranking: #{playerStat.bestRanking}</Badge>
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
										<Trophy className="h-4 w-4 text-blue-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{playerStat.totalTournaments}</p>
										<p className="text-xs text-muted-foreground">Tournaments</p>
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

						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-2">
									<div className="rounded-lg bg-green-100 p-2">
										<Target className="h-4 w-4 text-green-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{playerStat.overallWinRate.toFixed(1)}%</p>
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
										<p className="text-2xl font-bold">{playerStat.racksWinRate.toFixed(1)}%</p>
										<p className="text-xs text-muted-foreground">Rack Win Rate</p>
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

			<RecentMatches playerId={playerId} matches={playerStat.recentMatches} />

			{/* Tabs for detailed information */}
			{/*<Tabs className="space-y-6" defaultValue="achievements">*/}
			{/*	<TabsList>*/}
			{/*		/!*<TabsTrigger value="tournaments">Tournament History</TabsTrigger>*!/*/}
			{/*		<TabsTrigger value="achievements">Achievements</TabsTrigger>*/}
			{/*		<TabsTrigger value="matches">Recent Matches</TabsTrigger>*/}
			{/*	</TabsList>*/}

			{/*	/!*<TabsContent value="tournaments">*!/*/}
			{/*	/!*	<TournamentHistory tournaments={player.tournaments} />*!/*/}
			{/*	/!*</TabsContent>*!/*/}

			{/*	<TabsContent value="matches">*/}
			{/*	</TabsContent>*/}

			{/*	<TabsContent value="achievements">*/}
			{/*	</TabsContent>*/}
			{/*</Tabs>*/}
		</div>
	);
}
