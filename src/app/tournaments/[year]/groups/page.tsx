import React from "react";
import Link from "next/link";
import { Users, Trophy, Calendar, TrendingUp, ArrowRight } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

import { PageBreadcrumb } from "@/components/page-breadcrumb";

import { Links } from "@/utils/links";
import { toLabel, getStatusColor } from "@/utils/strings";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ year: string }>;
}

const completionPercentage = (completed: number, total: number) => {
	return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export default async function GroupsIndexPage({ params }: Props) {
	const { year } = await params;
	const tournamentRepo = new TournamentRepository();

	const tournamentInfo = await tournamentRepo.getInfoByYear({ year });
	const groups = await tournamentRepo.getGroupSummaries(year);

	const overallProgress =
		(groups.reduce((acc, group) => acc + group.completedMatches, 0) / groups.reduce((acc, group) => acc + group.matches.length, 0)) * 100;

	return (
		<div className="container mx-auto space-y-8 py-8">
			<PageBreadcrumb
				items={[Links.Tournaments.get(), Links.Tournaments.Year.get(year, tournamentInfo.name), Links.Tournaments.Year.Groups.get(year)]}
			/>

			{/* Tournament Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Trophy className="h-10 w-10 text-primary" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tournament Groups</h1>
						<p className="text-xl text-muted-foreground">{tournamentInfo.name}</p>
					</div>
				</div>

				{/* Tournament Stats */}
				<div className="flex justify-center gap-8 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Users className="h-4 w-4" />
						{tournamentInfo.totalPlayers} Players
					</div>
					<div className="flex items-center gap-1">
						<Trophy className="h-4 w-4" />
						{tournamentInfo.totalGroups} Groups
					</div>
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						{new Date(tournamentInfo.startDate).toLocaleDateString()} - {new Date(tournamentInfo.endDate).toLocaleDateString()}
					</div>
				</div>
			</div>

			<Separator />

			{/* Overall Progress */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						Tournament Progress
					</CardTitle>
					<CardDescription>Overall completion status across all groups</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 space-y-2">
						<div className="flex justify-between text-sm">
							<span>Matches Completed</span>
							<span>{Math.round(overallProgress)}%</span>
						</div>
						<Progress className="h-2" value={overallProgress} />
						<p className="text-xs text-muted-foreground">
							{groups.reduce((acc, group) => acc + group.completedMatches, 0)} of {groups.reduce((acc, group) => acc + group.matches.length, 0)} total
							matches completed
						</p>
					</div>

					{/* Quick Stats */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-2">
									<div className="rounded-lg bg-gray-100 p-2">
										<Calendar className="h-4 w-4 text-gray-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{groups.filter((g) => g.status === "upcoming").length}</p>
										<p className="text-xs text-muted-foreground">Groups Upcoming</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center gap-2">
									<div className="rounded-lg bg-blue-100 p-2">
										<Users className="h-4 w-4 text-blue-600" />
									</div>
									<div>
										<p className="text-2xl font-bold">{groups.filter((g) => g.status === "ongoing").length}</p>
										<p className="text-xs text-muted-foreground">Groups Active</p>
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
										<p className="text-2xl font-bold">{groups.filter((g) => g.status === "completed").length}</p>
										<p className="text-xs text-muted-foreground">Groups Completed</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* Groups Grid */}
			<div>
				<h2 className="mb-6 text-2xl font-semibold">Groups</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{groups.map((group) => (
						<Card key={group.id} className="transition-shadow hover:shadow-lg">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-xl">{group.name}</CardTitle>
									<Badge className={getStatusColor(group.status)}>{toLabel(group.status)}</Badge>
								</div>
								<CardDescription>{group.players.length} players competing</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Match Progress */}
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Matches</span>
										<span>
											{group.completedMatches}/{group.matches.length}
										</span>
									</div>
									<Progress className="h-2" value={completionPercentage(group.completedMatches, group.matches.length)} />
								</div>

								{/* Current Leader */}
								<div className="space-y-1">
									{group.leader && (
										<>
											<p className="text-sm font-medium">Current Leader</p>
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">{group.leader.name}</span>
												{group.leader.points > 0 && (
													<Badge variant="outline" className="text-xs">
														{group.leader.points} pts
													</Badge>
												)}
											</div>
										</>
									)}
								</div>

								{/* Action Button */}
								<Button asChild className="w-full" variant={group.status === "upcoming" ? "outline" : "default"}>
									<Link className="flex items-center gap-2" href={`/tournaments/${year}/groups/${group.id}`}>
										{group.status === "upcoming" ? "Preview Group" : "View Details"}
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
