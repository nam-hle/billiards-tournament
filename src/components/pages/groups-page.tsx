import React from "react";
import Link from "next/link";
import { sumBy } from "es-toolkit";
import { Users, Trophy, Calendar, TrendingUp, ArrowRight } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Progress } from "@/components/shadcn/progress";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

import { PageHeader } from "@/components/layouts/page-header";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { type TournamentSummary } from "@/interfaces";
import { toLabel, getStatusColor } from "@/utils/strings";

const completionPercentage = (completed: number, total: number) => {
	return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export function GroupsPage({ tournament }: { tournament: TournamentSummary }) {
	const { name, groups } = tournament;

	const overallProgress = (sumBy(groups, (group) => group.completedMatches) / sumBy(groups, (group) => group.matches.length)) * 100;

	return (
		<PageContainer
			items={[
				Links.Tournaments.get(),
				Links.Tournaments.Tournament.get(tournament.id, name),
				Links.Tournaments.Tournament.Groups.get(tournament.id)
			]}>
			<PageHeader title="Groups" description="View the current standings and matchups across all tournament groups" />

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
							{sumBy(groups, (group) => group.completedMatches)} of {sumBy(groups, (group) => group.matches.length)} total matches completed
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
									<CardTitle className="text-xl">{`Group ${group.name}`}</CardTitle>
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
									<Link className="flex items-center gap-2" href={`/tournaments/${tournament.id}/groups/${group.name}`}>
										{group.status === "upcoming" ? "Preview Group" : "View Details"}
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</PageContainer>
	);
}
