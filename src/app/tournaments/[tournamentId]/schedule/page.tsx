import { SchedulePage } from "@/components/pages/schedule-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function Page({ params }: Props) {
	const { tournamentId } = await params;

	return <SchedulePage tournament={await new TournamentRepository().getSummary({ tournamentId })} />;
}
