import React from "react";

import { TournamentPage } from "@/components/pages/tournament-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function ServerTournamentPage({ params }: Props) {
	const { tournamentId } = await params;

	return <TournamentPage tournament={await new TournamentRepository().getSummary({ tournamentId })} />;
}
