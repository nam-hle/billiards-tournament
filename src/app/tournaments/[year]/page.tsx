import React from "react";

import { TournamentPage } from "@/components/pages/tournament-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

export async function generateStaticParams() {
	const tournaments = await new TournamentRepository().getAll();

	return tournaments.map((tournament) => ({ year: tournament.year }));
}

interface Props {
	params: Promise<{ year: string }>;
}

export default async function ServerTournamentPage({ params }: Props) {
	const { year } = await params;
	const data = await new TournamentRepository().getData(year);

	return <TournamentPage data={data} />;
}
