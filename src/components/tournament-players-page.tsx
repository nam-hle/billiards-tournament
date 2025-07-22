"use client";

import Link from "next/link";
import { useState } from "react";
import { Users, Medal, Trophy, Search, Filter, Target } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { type Group, type PlayerTournamentStat } from "@/interfaces";

namespace PlayersPageClient {
	export interface Props {
		year: string;
		name: string;
		groups: Group[];
		players: PlayerTournamentStat[];
	}
}

export function PlayersPageClient(props: PlayersPageClient.Props) {
	const { year, name, groups, players } = props;
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [sortBy, setSortBy] = useState("points");

	// Filter and sort players
	const filteredPlayers = players
		.filter((player) => {
			const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesGroup = selectedGroup === "all" || player.group.id === selectedGroup;
			const matchesStatus = selectedStatus === "all" || player.status === selectedStatus;

			return matchesSearch && matchesGroup && matchesStatus;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "wins":
					return b.wins - a.wins;
				case "winRate":
					return b.winRate - a.winRate;
				case "name":
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});

	const totalPlayers = players.length;
	const activePlayers = players.filter((p) => p.status === "active").length;
	const qualifiedPlayers = players.filter((p) => p.status === "qualified").length;
	const eliminatedPlayers = players.filter((p) => p.status === "eliminated").length;

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Users className="h-8 w-8 text-primary" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tournament Players</h1>
						<p className="text-xl text-muted-foreground">
							{name} - {year}
						</p>
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

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="points">Points</SelectItem>
								<SelectItem value="wins">Wins</SelectItem>
								<SelectItem value="winRate">Win Rate</SelectItem>
								<SelectItem value="name">Name</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Players Display */}
			<PlayersTable year={year} players={filteredPlayers} />

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

function PlayersTable({ year, players }: { year: string; players: PlayerTournamentStat[] }) {
	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Rank</TableHead>
							<TableHead>Player</TableHead>
							<TableHead>Group</TableHead>
							<TableHead className="text-center">Played</TableHead>
							<TableHead className="text-center">Wins</TableHead>
							<TableHead className="text-center">Losses</TableHead>
							<TableHead className="text-center">Win Rate</TableHead>
							<TableHead className="text-center">Status</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
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
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage alt={player.name} src="/placeholder.svg" />
												<AvatarFallback className="text-xs">
													{player.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{player.name}</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
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
									<TableCell className="text-center">{player.winRate.toFixed(1)}%</TableCell>
									<TableCell className="text-center">
										<Badge className={getStatusColor(player.status)}>{getStatusText(player.status)}</Badge>
									</TableCell>
									<TableCell>
										<Button asChild size="sm" variant="outline">
											<Link href={`/tournaments/${year}/players/${player.id}`}>View</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

const getStatusColor = (status: string) => {
	switch (status) {
		case "qualified":
			return "bg-green-100 text-green-800";
		case "active":
			return "bg-blue-100 text-blue-800";
		case "eliminated":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getStatusText = (status: string) => {
	switch (status) {
		case "qualified":
			return "Qualified";
		case "active":
			return "Active";
		case "eliminated":
			return "Eliminated";
		default:
			return "Unknown";
	}
};
