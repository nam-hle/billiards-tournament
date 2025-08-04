import { SchedulePageClient } from "@/components/pages/schedule-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function TournamentSchedulePage({ params }: Props) {
	const { tournamentId } = await params;

	return <SchedulePageClient tournament={await new TournamentRepository().getSummary({ tournamentId })} />;
}
