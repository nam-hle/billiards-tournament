"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Users, Search, Trophy, Filter, Target, Calendar } from "lucide-react";

import { Input } from "@/components/shadcn/input";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { toLabel, getStatusColor } from "@/utils/strings";
import { ISOTime, type TournamentSummary } from "@/interfaces";

export namespace TournamentsPage {
	export interface Props {
		readonly tournaments: TournamentSummary[];
	}
}

export function ClientTournamentsPage(props: TournamentsPage.Props) {
	const { tournaments } = props;
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredTournaments = tournaments.filter((tournament) => {
		const matchesSearch =
			tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) || tournament.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	return (
		<PageContainer items={[Links.Tournaments.get()]}>
			{/* Header */}
			<div className="mb-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
						<p className="text-xl text-muted-foreground">Discover and join exciting tournaments</p>
					</div>
				</div>
			</div>

			{/* Filters */}
			<Card className="mb-6">
				<CardContent className="pt-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input className="pl-10" value={searchTerm} placeholder="Search tournaments..." onChange={(e) => setSearchTerm(e.target.value)} />
						</div>
						<div className="flex gap-2">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-[140px]">
									<Filter className="mr-2 h-4 w-4" />
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="upcoming">Upcoming</SelectItem>
									<SelectItem value="ongoing">Ongoing</SelectItem>
									<SelectItem value="registration">Registration</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tournament Grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{filteredTournaments.map((tournament) => (
					<Link key={tournament.id} href={`/tournaments/${tournament.year}`}>
						<Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
							<div className="aspect-video overflow-hidden">
								<Image
									width={500}
									height={400}
									alt={tournament.name}
									src={tournament.image}
									className="h-full w-full object-cover transition-transform hover:scale-105"
								/>
							</div>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="line-clamp-1 text-lg">{tournament.name}</CardTitle>
									<Badge className={getStatusColor(tournament.status)}>{toLabel(tournament.status)}</Badge>
								</div>
								<CardDescription className="line-clamp-2">{tournament.description}</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-3">
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											<span>{ISOTime.formatDate(tournament.startTime)}</span>
										</div>
										<div className="flex items-center gap-1">
											<Users className="h-4 w-4" />
											<span>{tournament.players.length}</span>
										</div>
										<div className="flex items-center gap-1">
											<Target className="h-4 w-4" />
											<span>{tournament.matches.length}</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{/* No results */}
			{filteredTournaments.length === 0 && (
				<Card className="py-12">
					<CardContent className="text-center">
						<Trophy className="mx-auto mb-4 h-12 w-12 text-gray-400" />
						<h3 className="mb-2 text-lg font-semibold">No tournaments found</h3>
						<p className="text-gray-600">Try adjusting your search or filters</p>
					</CardContent>
				</Card>
			)}
		</PageContainer>
	);
}
