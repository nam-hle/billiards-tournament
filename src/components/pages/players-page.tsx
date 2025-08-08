"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Minus, Search, MoveUp, MoveDown } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";
import { PageHeader } from "@/components/layouts/page-header";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { formatRatio } from "@/utils/strings";
import { type PlayerOverallStat } from "@/interfaces";

namespace PlayersPage {
	export interface Props {
		players: (PlayerOverallStat & { rankDiff: number })[];
	}
}

export function PlayersPage(props: PlayersPage.Props) {
	const { players } = props;
	const [searchTerm, setSearchTerm] = useState("");

	const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<PageContainer items={[Links.Players.get()]}>
			<PageHeader title="Players" description="Browse all billiards players and track their stats, and rankings" />

			{/* Filters and Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input value={searchTerm} className="w-[250px]" placeholder="Search players..." onChange={(e) => setSearchTerm(e.target.value)} />
						</div>
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
		</PageContainer>
	);
}

function PlayersTable({ players }: { players: (PlayerOverallStat & { rankDiff: number })[] }) {
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
							<TableHead className="text-center" title="Compared to ranking after previous 10 matches">
								Rating
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players
							.sort((a, b) => b.eloRating - a.eloRating)
							.map((player, index) => (
								<TableRow key={player.id} className="cursor-pointer" onClick={() => router.push(`/players/${player.id}`)}>
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
											{player.matchWins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{player.matchLosses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">{formatRatio(player.matchWinRate)}</TableCell>
									<TableCell className="text-center font-bold">
										<div className="flex flex-row items-center justify-center gap-1">
											{player.eloRating.toFixed(0)}
											{player.rankDiff ? getChangeIcon(player.rankDiff) : null}
											<span className={`font-mono ${getChangeColor(player.rankDiff)}`}>{Math.abs(player.rankDiff) || ""}</span>
										</div>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

const getChangeColor = (diff: number) => {
	if (diff > 0) {
		return "text-green-600";
	}

	if (diff < 0) {
		return "text-red-600";
	}

	return "text-gray-500";
};

const getChangeIcon = (diff: number) => {
	if (diff > 0) {
		return <MoveUp className={`h-4 w-4 ${getChangeColor(diff)}`} />;
	}

	if (diff < 0) {
		return <MoveDown className={`h-4 w-4 ${getChangeColor(diff)}`} />;
	}

	return <Minus className={`h-4 w-4 ${getChangeColor(diff)}`} />;
};
