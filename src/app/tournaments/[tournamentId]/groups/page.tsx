import React from "react";

import { GroupsPage } from "@/components/pages/groups-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

export async function generateStaticParams() {
	const tournaments = await new TournamentRepository().getAll();

	return tournaments.map((tournament) => ({ tournamentId: tournament.id }));
}

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function GroupsIndexPage({ params }: Props) {
	const { tournamentId } = await params;

	return <GroupsPage tournament={await new TournamentRepository().getSummary({ tournamentId })} />;
}
