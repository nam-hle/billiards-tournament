import React from "react";

import { KnockoutPage } from "@/components/pages/knockout-page";

import { KnockoutMatch } from "@/interfaces";
import { MatchRepository } from "@/repositories/match.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function Page({ params }: Props) {
	const { tournamentId } = await params;

	const tournament = new TournamentRepository().getSummary({ tournamentId });
	const knockoutMatches = new MatchRepository()
		.query({ tournamentId })
		.then((matches) => matches.filter(KnockoutMatch.isInstance).sort((a, b) => a.order - b.order));
	const qualifiedPlayers = new GroupRepository().getAdvancedPlayers({ tournamentId });

	return <KnockoutPage tournament={tournament} knockoutMatches={knockoutMatches} qualifiedPlayers={qualifiedPlayers} />;
}
