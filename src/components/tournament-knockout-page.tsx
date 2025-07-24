import { Medal, Crown, Award, Trophy, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { formatDate, formatTime } from "@/utils/date-time";
import { toLabel, getAbbrName, getStatusColor } from "@/utils/strings";
import { Match, CompletedMatch, type GroupStanding, type KnockoutMatch, DefinedPlayersMatch } from "@/interfaces";

function MatchCard({ match, isWinner = false }: { isWinner?: boolean; match: KnockoutMatch }) {
	const date = CompletedMatch.isInstance(match) ? formatDate(match.scheduledAt.date) : "TBD";
	const time = CompletedMatch.isInstance(match) ? formatTime(match.scheduledAt.time) : "TBD";

	return (
		<Card className={`${isWinner ? "bg-yellow-50 ring-2 ring-yellow-400" : ""} transition-shadow hover:shadow-md`}>
			<CardContent className="p-4">
				<div className="space-y-3">
					{/* Match Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="text-xs">
								{toLabel(match.type)} {match.type !== "final" ? match.order : ""}
							</Badge>
							{isWinner && <Crown className="h-4 w-4 text-yellow-600" />}
						</div>
						<Badge className={getStatusColor(Match.getStatus(match))}>{toLabel(Match.getStatus(match))}</Badge>
					</div>

					{/* Players */}
					<div className="space-y-2">
						{/* Player 1 */}
						<div className="flex items-center justify-between">
							<div className="flex min-w-0 items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage alt={DefinedPlayersMatch.isInstance(match) ? match.player1Name : ""} />
									<AvatarFallback className="text-xs">{DefinedPlayersMatch.isInstance(match) ? getAbbrName(match.player1Name) : "?"}</AvatarFallback>
								</Avatar>
								<span
									className={`truncate text-sm ${CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player1Id ? "font-semibold text-green-600" : ""}`}>
									{DefinedPlayersMatch.isInstance(match) ? match.player1Name : "TBD"}
								</span>
								{CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player1Id && (
									<Badge variant="default" className="px-1 py-0 text-xs">
										W
									</Badge>
								)}
							</div>
							{CompletedMatch.isInstance(match) && (
								<span className={`font-bold ${CompletedMatch.getWinnerId(match) === match.player1Id ? "text-green-600" : ""}`}>{match.score1}</span>
							)}
						</div>

						{/* Player 2 */}
						<div className="flex items-center justify-between">
							<div className="flex min-w-0 items-center gap-2">
								<Avatar className="h-6 w-6">
									<AvatarImage alt={DefinedPlayersMatch.isInstance(match) ? match.player2Name : ""} />
									<AvatarFallback className="text-xs">{DefinedPlayersMatch.isInstance(match) ? getAbbrName(match.player2Name) : "?"}</AvatarFallback>
								</Avatar>
								<span
									className={`truncate text-sm ${CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player2Id ? "font-semibold text-green-600" : ""}`}>
									{DefinedPlayersMatch.isInstance(match) ? match.player2Name : "TBD"}
								</span>
								{CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player2Id && (
									<Badge variant="default" className="px-1 py-0 text-xs">
										W
									</Badge>
								)}
							</div>
							{CompletedMatch.isInstance(match) && (
								<span className={`font-bold ${CompletedMatch.getWinnerId(match) === match.player2Id ? "text-green-600" : ""}`}>{match.score2}</span>
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
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function TournamentBracket({ matches }: { matches: KnockoutMatch[] }) {
	const quarterFinals = matches.filter((m) => m.type === "quarter-final");
	const semiFinals = matches.filter((m) => m.type === "semi-final");
	const final = matches.find((m) => m.type === "final");

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

export function QualifiedPlayersList({ players }: { players: GroupStanding[] }) {
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
							<TableRow key={player.playerId}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage alt={player.playerName} />
											<AvatarFallback className="text-xs">{getAbbrName(player.playerName)}</AvatarFallback>
										</Avatar>
										<span className="font-medium">{player.playerName}</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant="outline">{player.groupName}</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge className="font-semibold" variant={player.groupPosition === 1 ? "default" : "secondary"}>
										{player.groupPosition}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant="default" className="font-semibold">
										{player.points}
									</Badge>
								</TableCell>
								<TableCell className="text-center">
									<span className="text-sm">
										<span className="font-medium text-green-600">{player.wins}</span>
										<span className="mx-1 text-muted-foreground">/</span>
										<span className="font-medium text-red-600">{player.losses}</span>
									</span>
								</TableCell>
								<TableCell className="text-center">{isNaN(player.racksWinRate) ? "-" : `${player.racksWinRate.toFixed(1)}%`}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
