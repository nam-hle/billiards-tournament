import React from "react";

import { KnockoutPage } from "@/components/pages/knockout-page";

import { MatchRepository } from "@/repositories/match.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function Page({ params }: Props) {
	const { tournamentId } = await params;

	const tournament = new TournamentRepository().getById({ tournamentId });
	const knockoutMatches = new MatchRepository().query({ tournamentId, groupId: null }).then((matches) => matches.sort((a, b) => a.order - b.order));
	const qualifiedPlayers = new GroupRepository().getAdvancedPlayers({ tournamentId });

	return <KnockoutPage tournament={tournament} knockoutMatches={knockoutMatches} qualifiedPlayers={qualifiedPlayers} />;
}
