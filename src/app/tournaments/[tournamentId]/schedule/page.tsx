import { Suspense } from "react";

import { SchedulePage } from "@/components/pages/schedule-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

export async function generateStaticParams() {
	const tournaments = await new TournamentRepository().getAll();

	return tournaments.map((tournament) => ({ tournamentId: tournament.id }));
}

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function Page({ params }: Props) {
	const { tournamentId } = await params;

	return (
		<Suspense>
			<SchedulePage tournament={await new TournamentRepository().getSummary({ tournamentId })} />
		</Suspense>
	);
}
