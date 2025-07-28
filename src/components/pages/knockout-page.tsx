import Link from "next/link";
import { Medal, Crown, Award, Trophy, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";

import { toLabel, getStatusColor } from "@/utils/strings";
import { Match, ISOTime, CompletedMatch, type GroupStanding, type KnockoutMatch, DefinedPlayersMatch } from "@/interfaces";

function MatchCard({ match, isFinal = false }: { isFinal?: boolean; match: KnockoutMatch }) {
	return (
		<Link passHref href={`/matches/${match.id}`}>
			<Card className={`${isFinal ? "bg-yellow-50 ring-2 ring-yellow-400" : ""} transition-shadow hover:shadow-md`}>
				<CardContent className="p-4">
					<div className="space-y-3">
						{/* Match Header */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{Match.formatId(match)}
								</Badge>
								<Badge variant="outline" className="text-xs">
									{toLabel(match.type)} {match.type !== "final" ? match.order : ""}
								</Badge>
							</div>
							<Badge className={getStatusColor(Match.getStatus(match))}>{toLabel(Match.getStatus(match))}</Badge>
						</div>

						{/* Players */}
						<div className="space-y-2">
							{/* Player 1 */}
							<div className="flex items-center justify-between">
								<PlayerDisplay
									fallbackName="TBD"
									avatarClassName="h-6 w-6"
									containerClassName="gap-2"
									player={DefinedPlayersMatch.isInstance(match) ? { id: match.player1Id, name: match.player1Name } : undefined}
									nameClassName={`text-sm ${CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player1Id ? "font-semibold text-green-600" : ""}`}
								/>
								{CompletedMatch.isInstance(match) && (
									<span className={`font-bold ${CompletedMatch.getWinnerId(match) === match.player1Id ? "text-green-600" : ""}`}>{match.score1}</span>
								)}
							</div>

							{/* Player 2 */}
							<div className="flex items-center justify-between">
								<PlayerDisplay
									fallbackName="TBD"
									avatarClassName="h-6 w-6"
									containerClassName="gap-2"
									player={DefinedPlayersMatch.isInstance(match) ? { id: match.player2Id, name: match.player2Name } : undefined}
									nameClassName={`text-sm ${CompletedMatch.isInstance(match) && CompletedMatch.getWinnerId(match) === match.player2Id ? "font-semibold text-green-600" : ""}`}
								/>
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
									{ISOTime.formatDateTime(match.scheduledAt)}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
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
						<MatchCard isFinal match={final} />
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
									<PlayerDisplay player={{ id: player.playerId, name: player.playerName }} />
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
