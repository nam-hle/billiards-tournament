import { Medal, Crown, Award, Trophy, MapPin, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { toLabel, getStatusColor } from "@/utils/strings";

interface KnockoutPlayer {
	id: string;
	name: string;
	wins: number;
	seed: number;
	losses: number;
	avatar?: string;
	groupId: string;
	winRate: number;
	groupName: string;
	totalPoints: number;
	groupPosition: number;
}

interface KnockoutMatch {
	id: string;
	venue?: string;
	score1?: number;
	score2?: number;
	matchNumber: number;
	scheduledAt?: string;
	winner?: KnockoutPlayer;
	player1?: KnockoutPlayer;
	player2?: KnockoutPlayer;
	stage: "quarter" | "semi" | "final";
	status: "scheduled" | "in-progress" | "completed";
}

function MatchCard({ match, isWinner = false }: { isWinner?: boolean; match: KnockoutMatch }) {
	const formatDateTime = (dateString?: string) => {
		if (!dateString) {
			return { date: "TBD", time: "TBD" };
		}

		const date = new Date(dateString);

		return {
			date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
			time: date.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" })
		};
	};

	const { date, time } = formatDateTime(match.scheduledAt);

	return (
		<Card className={`${isWinner ? "bg-yellow-50 ring-2 ring-yellow-400" : ""} transition-shadow hover:shadow-md`}>
			<CardContent className="p-4">
				<div className="space-y-3">
					{/* Match Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="text-xs">
								{match.stage.charAt(0).toUpperCase() + match.stage.slice(1)} {match.stage !== "final" ? match.matchNumber : ""}
							</Badge>
							{isWinner && <Crown className="h-4 w-4 text-yellow-600" />}
						</div>
						<Badge className={getStatusColor(match.status)}>{toLabel(match.status)}</Badge>
					</div>

					{/* Players */}
					<div className="space-y-2">
						{/* Player 1 */}
						<div className="flex items-center justify-between">
							<div className="flex min-w-0 items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage alt={match.player1?.name} src={match.player1?.avatar || "/placeholder.svg"} />
									<AvatarFallback className="text-xs">
										{match.player1?.name
											.split(" ")
											.map((n) => n[0])
											.join("") || "?"}
									</AvatarFallback>
								</Avatar>
								<span className={`truncate text-sm ${match.winner?.id === match.player1?.id ? "font-semibold text-green-600" : ""}`}>
									{match.player1?.name || "TBD"}
								</span>
								{match.winner?.id === match.player1?.id && (
									<Badge variant="default" className="px-1 py-0 text-xs">
										W
									</Badge>
								)}
							</div>
							{match.score1 != null && (
								<span className={`font-bold ${match.winner?.id === match.player1?.id ? "text-green-600" : ""}`}>{match.score1}</span>
							)}
						</div>

						{/* Player 2 */}
						<div className="flex items-center justify-between">
							<div className="flex min-w-0 items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage alt={match.player2?.name} src={match.player2?.avatar || "/placeholder.svg"} />
									<AvatarFallback className="text-xs">
										{match.player2?.name
											.split(" ")
											.map((n) => n[0])
											.join("") || "?"}
									</AvatarFallback>
								</Avatar>
								<span className={`truncate text-sm ${match.winner?.id === match.player2?.id ? "font-semibold text-green-600" : ""}`}>
									{match.player2?.name || "TBD"}
								</span>
								{match.winner?.id === match.player2?.id && (
									<Badge variant="default" className="px-1 py-0 text-xs">
										W
									</Badge>
								)}
							</div>
							{match.score2 != null && (
								<span className={`font-bold ${match.winner?.id === match.player2?.id ? "text-green-600" : ""}`}>{match.score2}</span>
							)}
						</div>
					</div>

					{/* Match Details */}
					{match.scheduledAt && (
						<div className="flex items-center gap-4 border-t pt-2 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-3 w-3" />
								{date} at {time}
							</div>
							{match.venue && (
								<div className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{match.venue}
								</div>
							)}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function TournamentBracket({ matches }: { matches: KnockoutMatch[] }) {
	const quarterFinals = matches.filter((m) => m.stage === "quarter");
	const semiFinals = matches.filter((m) => m.stage === "semi");
	const final = matches.find((m) => m.stage === "final");

	return (
		<div className="space-y-8">
			{/* Quarter Finals */}
			<div>
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Medal className="text-bronze h-5 w-5" />
					Quarter Finals
				</h3>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{quarterFinals.map((match) => (
						<MatchCard match={match} key={match.id} />
					))}
				</div>
			</div>

			{/* Semi Finals */}
			<div>
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Award className="text-silver h-5 w-5" />
					Semi Finals
				</h3>
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
					{semiFinals.map((match) => (
						<MatchCard match={match} key={match.id} />
					))}
				</div>
			</div>

			{/* Final */}
			{final && (
				<div>
					<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
						<Crown className="h-5 w-5 text-yellow-600" />
						Final
					</h3>
					<div className="mx-auto max-w-md">
						<MatchCard isWinner match={final} />
					</div>
				</div>
			)}
		</div>
	);
}

export function QualifiedPlayersList({ players }: { players: KnockoutPlayer[] }) {
	const getSeedColor = (seed: number) => {
		if (seed <= 2) {
			return "bg-yellow-100 text-yellow-800";
		}

		if (seed <= 4) {
			return "bg-blue-100 text-blue-800";
		}

		return "bg-gray-100 text-gray-800";
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Trophy className="h-5 w-5" />
					Qualified Players
				</CardTitle>
				<CardDescription>Top 8 players advancing to knockout phase</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[60px]">Seed</TableHead>
							<TableHead>Player</TableHead>
							<TableHead>Group</TableHead>
							<TableHead className="text-center">Position</TableHead>
							<TableHead className="text-center">Points</TableHead>
							<TableHead className="text-center">W/L</TableHead>
							<TableHead className="text-center">Win Rate</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players.map((player) => (
							<TableRow key={player.id}>
								<TableCell>
									<Badge variant="secondary" className={getSeedColor(player.seed)}>
										#{player.seed}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage alt={player.name} src={player.avatar || "/placeholder.svg"} />
											<AvatarFallback className="text-xs">
												{player.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium">{player.name}</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant="outline">{player.groupName}</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge
										variant={player.groupPosition === 1 ? "default" : "secondary"}
										className="flex h-6 w-6 items-center justify-center p-0 text-xs">
										{player.groupPosition}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="default" className="font-semibold">
										{player.totalPoints}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<span className="text-sm">
										<span className="font-medium text-green-600">{player.wins}</span>
										<span className="mx-1 text-muted-foreground">/</span>
										<span className="font-medium text-red-600">{player.losses}</span>
									</span>
								</TableCell>
								<TableCell className="text-center">{player.winRate.toFixed(1)}%</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
