import React from "react";
import { Crown, Trophy } from "lucide-react";

import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";

import { PageHeader } from "@/components/layouts/page-header";
import { PageContainer } from "@/components/layouts/page-container";
import { TournamentBracket, QualifiedPlayersList } from "@/components/pages/knockout-page";

import { Links } from "@/utils/links";
import { KnockoutMatch, CompletedMatch } from "@/interfaces";
import { MatchRepository } from "@/repositories/match.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

export async function generateStaticParams() {
	const tournaments = await new TournamentRepository().getAll();

	return tournaments.map((tournament) => ({ tournamentId: tournament.id }));
}

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function TournamentKnockoutPage({ params }: Props) {
	const { tournamentId } = await params;
	const tournament = await new TournamentRepository().getSummary({ tournamentId });
	const knockoutMatches = (await new MatchRepository().query({ tournamentId })).filter(KnockoutMatch.isInstance).sort((a, b) => a.order - b.order);
	const qualifiedPlayers = await new GroupRepository().getAdvancedPlayers({ tournamentId });

	const finalMatch = knockoutMatches.find((match) => match.type === "final");
	const championId = finalMatch && CompletedMatch.isInstance(finalMatch) ? CompletedMatch.getWinnerId(finalMatch) : undefined;
	const champion = qualifiedPlayers.find((player) => player.player.id === championId);
	const runnerUpId = finalMatch && CompletedMatch.isInstance(finalMatch) ? CompletedMatch.getLoserId(finalMatch) : undefined;
	const runnerUp = qualifiedPlayers.find((player) => player.player.id === runnerUpId);

	return (
		<PageContainer
			items={[
				Links.Tournaments.get(),
				Links.Tournaments.Year.get(tournament.year, tournament.name),
				Links.Tournaments.Year.Knockout.get(tournament.year)
			]}>
			<PageHeader title="Knockout Phase" description="Watch as the tournament heats up in the knockout stage" />

			<Separator />

			{/* Champion Banner */}
			{champion && runnerUp && (
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
			)}

			{/* Tournament Bracket */}
			<div>
				<h2 className="mb-6 text-2xl font-semibold">Tournament Bracket</h2>
				<TournamentBracket matches={knockoutMatches} />
			</div>

			<Separator />

			{/* Qualified Players */}
			<QualifiedPlayersList year={tournamentId} standings={qualifiedPlayers} />
		</PageContainer>
	);
}
