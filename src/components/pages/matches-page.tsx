"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Clock, Users, Search, Filter, Trophy } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { PlayerDisplay } from "@/components/player-display";
import { PageHeader } from "@/components/layouts/page-header";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { combineComparators } from "@/utils/comparator";
import { toLabel, getStatusColor } from "@/utils/strings";
import { Match, ISOTime, type Player, CompletedMatch, type Tournament, DefinedPlayersMatch } from "@/interfaces";

function MatchesFilters({
	players,
	searchTerm,
	tournaments,
	selectedStatus,
	onSearchChange,
	onStatusChange,
	onPlayerChange,
	selectedPlayer,
	onTournamentChange,
	selectedTournament
}: {
	players: Player[];
	searchTerm: string;
	selectedPlayer: string;
	selectedStatus: string;
	selectedTournament: string;
	onPlayerChange: (value: string) => void;
	onSearchChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onTournamentChange: (value: string) => void;
	tournaments: Array<{ year: string; name: string }>;
}) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<Search className="h-4 w-4 text-muted-foreground" />
						<Input
							value={searchTerm}
							className="w-[250px]"
							placeholder="Search players or tournaments..."
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm font-medium">Filters:</span>
					</div>

					<Select value={selectedTournament} onValueChange={onTournamentChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="All Tournaments" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Tournaments</SelectItem>
							{tournaments.map((tournament, index) => (
								<SelectItem key={index} value={tournament.year}>
									{tournament.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={selectedPlayer} onValueChange={onPlayerChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="All Players" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Players</SelectItem>
							{players.map((player, index) => (
								<SelectItem key={index} value={player.id}>
									{player.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={selectedStatus} onValueChange={onStatusChange}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="All Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="scheduled">Scheduled</SelectItem>
							<SelectItem value="scheduling">Scheduling</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
		</Card>
	);
}

function MatchesTable({ matches }: { matches: (Match & { tournament: Tournament })[] }) {
	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[120px] text-center">Date/Time</TableHead>
							<TableHead className="w-[150px] text-center">Tournament</TableHead>
							<TableHead>Player 1</TableHead>
							<TableHead className="w-[100px] text-center">Score</TableHead>
							<TableHead>Player 2</TableHead>
							<TableHead className="w-[100px] text-center">Status</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{matches.map((match) => {
							return (
								<TableRow key={match.id}>
									<TableCell className="text-center font-mono text-xs">
										{match.scheduledAt ? (
											<>
												<div>{ISOTime.formatDate(match.scheduledAt, { month: "2-digit", weekday: undefined })}</div>
												<div>{ISOTime.formatTime(match.scheduledAt)}</div>
											</>
										) : (
											"TBD"
										)}
									</TableCell>
									<TableCell>
										<div className="flex flex-col items-center space-y-1">
											<Link href={`/tournaments/${match.tournament.year}`} className="text-sm font-medium text-primary hover:underline">
												{match.tournament.name}
											</Link>
											<Badge variant="outline" className="text-xs">
												{Match.getName(match)}
											</Badge>
										</div>
									</TableCell>
									<TableCell>
										<PlayerDisplay player={match.player1} />
									</TableCell>
									<TableCell className="text-center">
										{CompletedMatch.isInstance(match) ? (
											<Badge variant="outline" className="font-mono">
												{match.score1} : {match.score2}
											</Badge>
										) : (
											<span className="text-muted-foreground">-</span>
										)}
									</TableCell>
									<TableCell>
										<PlayerDisplay player={match.player2} />
									</TableCell>
									<TableCell className="text-center">
										<Badge className={getStatusColor(Match.getStatus(match))}>{toLabel(Match.getStatus(match))}</Badge>
									</TableCell>
									<TableCell>
										<Button asChild size="sm" variant="outline">
											<Link href={`/matches/${match.id}`}>View</Link>
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export function MatchesPage({
	matches,
	players,
	tournaments
}: {
	players: Player[];
	tournaments: Tournament[];
	matches: (Match & { tournament: Tournament })[];
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [player, setPlayer] = useState("all");
	const [selectedTournament, setSelectedTournament] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");

	// Filter matches
	const filteredMatches = matches.filter((match) => {
		const matchesSearch =
			DefinedPlayersMatch.isInstance(match) &&
			(match.player1.name.toLowerCase().includes(searchTerm.toLowerCase()) || match.player2.name.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesTournament = selectedTournament === "all" || selectedTournament === `${match.tournament.year}`;
		const matchesStatus = selectedStatus === "all" || Match.getStatus(match) === selectedStatus;
		const matchesPlayer = player === "all" || Match.hasPlayer(match, player);

		return matchesSearch && matchesStatus && matchesTournament && matchesPlayer;
	});

	// Sort matches by date (most recent first)
	const sortedMatches = filteredMatches.sort(
		combineComparators(
			(a, b) => +b.tournament.year - +a.tournament.year,
			(a, b) => +CompletedMatch.isInstance(a) - +CompletedMatch.isInstance(b),
			(a, b) => {
				if (!CompletedMatch.isInstance(a) || !CompletedMatch.isInstance(b)) {
					return 0; // Keep unscheduled matches in their original order
				}

				return ISOTime.createComparator("desc")(a.scheduledAt, b.scheduledAt);
			}
		)
	);

	const completedMatches = sortedMatches.filter((m) => Match.getStatus(m) === "completed");
	const upcomingMatches = sortedMatches.length - completedMatches.length;
	// const recentMatches = sortedMatches.filter((m) => Match.getStatus(m) === "completed").slice(0, 10);

	return (
		<PageContainer items={[Links.Matches.get()]}>
			<PageHeader title="Matches" description="Complete match history across all tournaments" />

			{/* Quick Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-orange-100 p-2">
								<Clock className="h-4 w-4 text-orange-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{upcomingMatches}</p>
								<p className="text-xs text-muted-foreground">Upcoming</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-green-100 p-2">
								<Trophy className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{completedMatches.length}</p>
								<p className="text-xs text-muted-foreground">Completed</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-gray-100 p-2">
								<Users className="h-4 w-4 text-gray-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{filteredMatches.length}</p>
								<p className="text-xs text-muted-foreground">Total Matches</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<MatchesFilters
				players={players}
				searchTerm={searchTerm}
				selectedPlayer={player}
				tournaments={tournaments}
				onPlayerChange={setPlayer}
				onSearchChange={setSearchTerm}
				selectedStatus={selectedStatus}
				onStatusChange={setSelectedStatus}
				selectedTournament={selectedTournament}
				onTournamentChange={setSelectedTournament}
			/>

			<MatchesTable matches={sortedMatches} />

			{filteredMatches.length === 0 && (
				<div className="py-12 text-center">
					<Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h3 className="mb-2 text-lg font-semibold">No matches found</h3>
					<p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
				</div>
			)}
		</PageContainer>
	);
}
