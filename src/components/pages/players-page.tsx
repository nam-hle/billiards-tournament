"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

import { Links } from "@/utils/links";
import { formatRatio } from "@/utils/strings";
import { type PlayerStat } from "@/interfaces";

namespace PlayersPageClient {
	export interface Props {
		players: PlayerStat[];
	}
}

export function PlayersPageClient(props: PlayersPageClient.Props) {
	const { players } = props;
	const [searchTerm, setSearchTerm] = useState("");
	// const [sortBy, setSortBy] = useState("points");

	// Filter and sort players
	const filteredPlayers = players
		.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => b.eloRating - a.eloRating);

	return (
		<div className="container mx-auto space-y-8 py-8">
			<PageBreadcrumb items={[Links.Players.get()]} />

			{/* Header */}
			<div className="mb-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Players</h1>
						<p className="text-gray-600"> Browse all billiards players and track their stats, and rankings</p>
					</div>
				</div>
			</div>

			<Separator />

			{/* Filters and Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input value={searchTerm} className="w-[250px]" placeholder="Search players..." onChange={(e) => setSearchTerm(e.target.value)} />
						</div>

						{/*<div className="flex items-center gap-2">*/}
						{/*	<Filter className="h-4 w-4 text-muted-foreground" />*/}
						{/*	<span className="text-sm font-medium">Filters:</span>*/}
						{/*</div>*/}

						{/*<Select value={sortBy} onValueChange={setSortBy}>*/}
						{/*	<SelectTrigger className="w-[140px]">*/}
						{/*		<SelectValue placeholder="Sort by" />*/}
						{/*	</SelectTrigger>*/}
						{/*	<SelectContent>*/}
						{/*		<SelectItem value="points">Points</SelectItem>*/}
						{/*		<SelectItem value="wins">Wins</SelectItem>*/}
						{/*		<SelectItem value="winRate">Win Rate</SelectItem>*/}
						{/*		<SelectItem value="name">Name</SelectItem>*/}
						{/*	</SelectContent>*/}
						{/*</Select>*/}
					</div>
				</CardContent>
			</Card>

			{/* Players Display */}
			<PlayersTable players={filteredPlayers} />

			{filteredPlayers.length === 0 && (
				<div className="py-12 text-center">
					<Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
					<h3 className="mb-2 text-lg font-semibold">No players found</h3>
					<p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
				</div>
			)}
		</div>
	);
}

function PlayersTable({ players }: { players: PlayerStat[] }) {
	const router = useRouter();

	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Rank</TableHead>
							<TableHead>Player</TableHead>
							<TableHead className="text-center">Played</TableHead>
							<TableHead className="text-center">Wins</TableHead>
							<TableHead className="text-center">Losses</TableHead>
							<TableHead className="text-center">Win Rate</TableHead>
							<TableHead className="text-center">Rating</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players
							.sort((a, b) => b.eloRating - a.eloRating)
							.map((player, index) => (
								<TableRow
									key={player.id}
									className="cursor-pointer"
									onClick={() => router.push(Links.Players.Player.get(player.id, player.name).href)}>
									<TableCell>
										<Badge variant={index < 3 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
											{index + 1}
										</Badge>
									</TableCell>
									<TableCell>
										<PlayerDisplay player={player} />
									</TableCell>
									<TableCell className="text-center">{player.totalMatches}</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{player.totalWins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{player.totalLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">{formatRatio(player.overallWinRate)}</TableCell>
									<TableCell className="text-center font-bold">{player.eloRating.toFixed(0)}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
