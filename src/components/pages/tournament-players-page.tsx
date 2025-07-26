"use client";

import React, { useState } from "react";
import { Users, Medal, Trophy, Search, Filter, Target } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { PlayerDisplay } from "@/components/player-display";
import { PageBreadcrumb } from "@/components/page-breadcrumb";

import { Links } from "@/utils/links";
import { toLabel, formatRatio, getStatusColor } from "@/utils/strings";
import { type Group, type Tournament, type PlayerTournamentStat } from "@/interfaces";

namespace PlayersPageClient {
	export interface Props {
		groups: Group[];
		tournament: Tournament;
		players: PlayerTournamentStat[];
	}
}

export function PlayersPageClient(props: PlayersPageClient.Props) {
	const { groups, players, tournament } = props;
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	// const [sortBy, setSortBy] = useState("points");

	// Filter and sort players
	const filteredPlayers = players
		.filter((player) => {
			const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesGroup = selectedGroup === "all" || player.group.id === selectedGroup;
			const matchesStatus = selectedStatus === "all" || player.status === selectedStatus;

			return matchesSearch && matchesGroup && matchesStatus;
		})
		.sort((a, b) => b.elo - a.elo);

	const totalPlayers = players.length;
	const activePlayers = players.filter((p) => p.status === "active").length;
	const qualifiedPlayers = players.filter((p) => p.status === "qualified").length;
	const eliminatedPlayers = players.filter((p) => p.status === "eliminated").length;

	return (
		<div className="container mx-auto space-y-8 py-8">
			<PageBreadcrumb
				items={[
					Links.Tournaments.get(),
					Links.Tournaments.Year.get(tournament.year, tournament.name),
					Links.Tournaments.Year.Players.get(tournament.year)
				]}
			/>

			{/* Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Users className="h-8 w-8 text-primary" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tournament Players</h1>
						<p className="text-xl text-muted-foreground">{tournament.name}</p>
					</div>
				</div>
			</div>

			<Separator />

			{/* Player Stats */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-blue-100 p-2">
								<Users className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{totalPlayers}</p>
								<p className="text-xs text-muted-foreground">Total Players</p>
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
								<p className="text-2xl font-bold">{qualifiedPlayers}</p>
								<p className="text-xs text-muted-foreground">Qualified</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-yellow-100 p-2">
								<Target className="h-4 w-4 text-yellow-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{activePlayers}</p>
								<p className="text-xs text-muted-foreground">Active</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="rounded-lg bg-red-100 p-2">
								<Medal className="h-4 w-4 text-red-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{eliminatedPlayers}</p>
								<p className="text-xs text-muted-foreground">Eliminated</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input value={searchTerm} className="w-[250px]" placeholder="Search players..." onChange={(e) => setSearchTerm(e.target.value)} />
						</div>

						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">Filters:</span>
						</div>

						<Select value={selectedGroup} onValueChange={setSelectedGroup}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="All Groups" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Groups</SelectItem>
								{groups.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={selectedStatus} onValueChange={setSelectedStatus}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="qualified">Qualified</SelectItem>
								<SelectItem value="eliminated">Eliminated</SelectItem>
							</SelectContent>
						</Select>

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

function PlayersTable({ players }: { players: PlayerTournamentStat[] }) {
	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Rank</TableHead>
							<TableHead>Player</TableHead>
							<TableHead className="text-center">Group</TableHead>
							<TableHead className="text-center">Played</TableHead>
							<TableHead className="text-center">Wins</TableHead>
							<TableHead className="text-center">Losses</TableHead>
							<TableHead className="text-center">Win Rate</TableHead>
							<TableHead className="text-center">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players
							.sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
							.map((player, index) => (
								<TableRow key={player.id}>
									<TableCell>
										<Badge variant={index < 3 ? "default" : "outline"} className="flex h-6 w-6 items-center justify-center p-0 text-xs">
											{index + 1}
										</Badge>
									</TableCell>
									<TableCell>
										<PlayerDisplay player={player} />
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="outline">{player.group.name}</Badge>
									</TableCell>
									<TableCell className="text-center">{player.playedMatches}</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{player.wins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{player.losses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">{formatRatio(player.winRate)}</TableCell>
									<TableCell className="text-center">
										<Badge className={getStatusColor(player.status)}>{toLabel(player.status)}</Badge>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
