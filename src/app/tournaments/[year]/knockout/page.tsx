import { Crown, Trophy, MapPin, Calendar } from "lucide-react";

import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { TournamentBracket, QualifiedPlayersList } from "@/components/tournament-knockout-page";

import { getAbbrName } from "@/utils/strings";
import { KnockoutMatch, CompletedMatch } from "@/interfaces";
import { MatchRepository } from "@/repositories/match.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ year: string }>;
}

export default async function TournamentKnockoutPage({ params }: Props) {
	const { year } = await params;
	const tournament = await new TournamentRepository().getInfoByYear({ year });
	const knockoutMatches = (await new MatchRepository().getAllByYear({ year })).filter(KnockoutMatch.isInstance);
	const qualifiedPlayers = await new GroupRepository().getAdvancedPlayers({ year });

	const finalMatch = knockoutMatches.find((match) => match.type === "final");
	const championId = finalMatch && CompletedMatch.isInstance(finalMatch) ? CompletedMatch.getWinnerId(finalMatch) : undefined;
	const champion = qualifiedPlayers.find((player) => player.playerId === championId);
	const runnerUpId = finalMatch && CompletedMatch.isInstance(finalMatch) ? CompletedMatch.getLoserId(finalMatch) : undefined;
	const runnerUp = qualifiedPlayers.find((player) => player.playerId === runnerUpId);

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Crown className="h-8 w-8 text-yellow-600" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Knockout Phase</h1>
						<p className="text-xl text-muted-foreground">
							{tournament.name} - {tournament.year}
						</p>
					</div>
				</div>

				<div className="flex justify-center gap-8 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Starts {new Date(tournament.startDate).toLocaleDateString()}
					</div>
					<div className="flex items-center gap-1">
						<MapPin className="h-4 w-4" />
						{tournament.venue}
					</div>
				</div>
			</div>

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
									<Avatar className="h-12 w-12">
										<AvatarImage alt={champion.playerName} />
										<AvatarFallback>{getAbbrName(champion.playerName)}</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-xl font-semibold text-yellow-800">{champion.playerName}</p>
										<p className="text-sm text-yellow-600">Defeated {runnerUp.playerName} in the final</p>
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
			<QualifiedPlayersList players={qualifiedPlayers} />
		</div>
	);
}
