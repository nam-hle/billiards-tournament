"use client";
import Link from "next/link";
import React, { use, Suspense } from "react";
import { Medal, Crown, Award, Trophy, Calendar } from "lucide-react";

import { Badge } from "@/components/shadcn/badge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Separator } from "@/components/shadcn/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

import { PlayerDisplay } from "@/components/player-display";
import { PageHeader } from "@/components/layouts/page-header";
import { SuspendableTable } from "@/components/suspendable-table";
import { PageContainer } from "@/components/layouts/page-container";

import { Links } from "@/utils/links";
import { toLabel, getStatusColor } from "@/utils/strings";
import { Match, ISOTime, CompletedMatch, type Tournament, type GroupStanding, type KnockoutMatch, DefinedPlayersMatch } from "@/interfaces";

export function KnockoutPage(props: {
	tournament: Promise<Tournament>;
	knockoutMatches: Promise<KnockoutMatch[]>;
	qualifiedPlayers: Promise<(GroupStanding & { knockoutPosition: number })[]>;
}) {
	const { knockoutMatches, qualifiedPlayers } = props;

	const tournament = use(props.tournament);

	return (
		<PageContainer
			items={[
				Links.Tournaments.get(),
				Links.Tournaments.Tournament.get(tournament.year, tournament.name),
				Links.Tournaments.Tournament.Knockout.get(tournament.year)
			]}>
			<PageHeader title="Knockout Phase" description="Watch as the tournament heats up in the knockout stage" />

			<Separator />

			<ChampionBanner {...props} />

			<div>
				<h2 className="mb-6 text-2xl font-semibold">Tournament Bracket</h2>
				<TournamentBracket matches={knockoutMatches} />
			</div>

			<Separator />

			<QualifiedPlayersList year={tournament.year} standings={qualifiedPlayers} />
		</PageContainer>
	);
}

function ChampionBanner(props: {
	knockoutMatches: Promise<KnockoutMatch[]>;
	qualifiedPlayers: Promise<(GroupStanding & { knockoutPosition: number })[]>;
}) {
	const knockoutMatches = use(props.knockoutMatches);
	const qualifiedPlayers = use(props.qualifiedPlayers);

	const finalMatch = knockoutMatches.find((match) => match.type === "final");
	const championId = finalMatch && CompletedMatch.isInstance(finalMatch) ? CompletedMatch.getWinnerId(finalMatch) : undefined;
	const champion = qualifiedPlayers.find((player) => player.player.id === championId);
	const runnerUpId = finalMatch && CompletedMatch.isInstance(finalMatch) ? CompletedMatch.getLoserId(finalMatch) : undefined;
	const runnerUp = qualifiedPlayers.find((player) => player.player.id === runnerUpId);

	if (!champion || !runnerUp) {
		return null;
	}

	return (
		<Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
			<CardContent className="pt-6">
				<div className="flex items-center justify-center gap-4">
					<Crown className="h-8 w-8 text-yellow-600" />
					<div className="text-center">
						<h2 className="text-2xl font-bold text-yellow-800">Tournament Champion</h2>
						<div className="mt-2 flex items-center justify-center gap-3">
							<div>
								<p className="text-xl font-semibold text-yellow-800">{champion.player.name}</p>
								<p className="text-sm text-yellow-600">Defeated {runnerUp.player.name} in the final</p>
							</div>
						</div>
					</div>
					<Trophy className="h-8 w-8 text-yellow-600" />
				</div>
			</CardContent>
		</Card>
	);
}

const SkeletonMatchCard = () => <Skeleton className="h-[160px] w-[300px]" />;

function MatchCard({ match, isFinal = false }: { isFinal?: boolean; match: KnockoutMatch }) {
	return (
		<Link passHref href={`/matches/${match.id}`}>
			<Card className={`${isFinal ? "ring-2 ring-yellow-400" : ""} transition-shadow hover:shadow-md`}>
				<CardContent className="p-4">
					<div className="space-y-3">
						{/* Match Header */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{Match.formatId(match)}
								</Badge>
								<Badge variant="outline" className="text-xs">
									{toLabel(match.type)} {match.type !== "final" ? match.order + 1 : ""}
								</Badge>
							</div>
							<Badge className={getStatusColor(Match.getStatus(match))}>{toLabel(Match.getStatus(match))}</Badge>
						</div>

						{/* Players */}
						<div className="space-y-2">
							{/* Player 1 */}
							<div className="flex items-center justify-between">
								<PlayerDisplay
									avatarClassName="h-6 w-6"
									containerClassName="gap-2"
									fallbackName={match.placeholder1 ?? undefined}
									player={DefinedPlayersMatch.isInstance(match) ? match.player1 : undefined}
									nameClassName={`text-sm ${CompletedMatch.isInstance(match) && CompletedMatch.isWinner(match, match.player1.id) ? "font-semibold text-green-600" : ""}`}
								/>
								{CompletedMatch.isInstance(match) && (
									<span className={`font-bold ${CompletedMatch.isWinner(match, match.player1.id) ? "text-green-600" : ""}`}>{match.score1}</span>
								)}
							</div>

							{/* Player 2 */}
							<div className="flex items-center justify-between">
								<PlayerDisplay
									avatarClassName="h-6 w-6"
									containerClassName="gap-2"
									fallbackName={match.placeholder2 ?? undefined}
									player={DefinedPlayersMatch.isInstance(match) ? match.player2 : undefined}
									nameClassName={`text-sm ${CompletedMatch.isInstance(match) && CompletedMatch.isWinner(match, match.player2.id) ? "font-semibold text-green-600" : ""}`}
								/>
								{CompletedMatch.isInstance(match) && (
									<span className={`font-bold ${CompletedMatch.isWinner(match, match.player2.id) ? "text-green-600" : ""}`}>{match.score2}</span>
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

function MatchCards({ type, matches }: { type: KnockoutMatch["type"]; matches: Promise<KnockoutMatch[]> }) {
	const filteredMatches = use(matches).filter((match) => match.type === type);

	return (
		<>
			{filteredMatches.map((match) => (
				<MatchCard match={match} key={match.id} />
			))}
		</>
	);
}

function TournamentBracket({ matches }: { matches: Promise<KnockoutMatch[]> }) {
	return (
		<div className="space-y-8">
			{/* Quarter Finals */}
			<div>
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Medal className="text-bronze h-5 w-5" />
					Quarter Finals
				</h3>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Suspense
						fallback={Array.from({ length: 4 }).map((_, index) => (
							<SkeletonMatchCard key={index} />
						))}>
						<MatchCards matches={matches} type="quarter-final" />
					</Suspense>
				</div>
			</div>
			{/* Semi Finals */}
			<div>
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Award className="text-silver h-5 w-5" />
					Semi Finals
				</h3>
				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
					<Suspense
						fallback={Array.from({ length: 2 }).map((_, index) => (
							<SkeletonMatchCard key={index} />
						))}>
						<MatchCards matches={matches} type="semi-final" />
					</Suspense>
				</div>
			</div>
			{/* Final */}
			<div>
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Crown className="h-5 w-5 text-yellow-600" />
					Final
				</h3>
				<div className="mx-auto max-w-md">
					<Suspense
						fallback={Array.from({ length: 1 }).map((_, index) => (
							<SkeletonMatchCard key={index} />
						))}>
						<MatchCards type="final" matches={matches} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

function QualifiedPlayersList(props: { year: string; standings: Promise<(GroupStanding & { knockoutPosition: number })[]> }) {
	const { year, standings } = props;

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
				<SuspendableTable
					data={standings}
					expectedNumberOfRows={8}
					dataKeyGetter={({ row }) => row.player.id}
					hrefGetter={({ row }) => `/players/${row.player.id}`}
					columns={[
						{
							label: "Player",
							alignment: "left",
							dataGetter: ({ row }) => <PlayerDisplay player={row.player} />
						},
						{
							label: "Group",
							dataGetter: ({ row }) => (
								<Link href={`/tournaments/${year}/groups/${row.groupName}`}>
									<Badge variant="outline">{row.groupName}</Badge>
								</Link>
							)
						},
						{
							label: "Group Position",
							dataGetter: ({ row }) => (
								<Badge className="font-semibold" variant={row.groupPosition === 1 ? "default" : "secondary"}>
									{row.groupPosition}
								</Badge>
							)
						},
						{
							label: "Played Matches",
							dataGetter: ({ row }) => (
								<Badge variant="secondary" className="font-semibold">
									{row.completedMatches.length}
								</Badge>
							)
						},
						{
							label: "Points",
							dataGetter: ({ row }) => (
								<Badge variant="default" className="font-semibold">
									{row.points}
								</Badge>
							)
						},
						{
							label: "Racks Difference",
							dataGetter: ({ row }) => (
								<span className={`text-sm font-medium ${row.racksDifference > 0 ? "text-green-600" : row.racksDifference < 0 ? "text-red-600" : ""}`}>
									{row.racksDifference}
								</span>
							)
						},
						{
							label: "Rack Wins",
							dataGetter: ({ row }) => <span className="text-sm font-medium text-green-600">{row.rackWins}</span>
						},
						{
							width: 50,
							label: "Rank",
							dataGetter: ({ row }) => <Badge variant="outline">{`#${row.knockoutPosition}`}</Badge>
						}
					]}
				/>
			</CardContent>
		</Card>
	);
}
