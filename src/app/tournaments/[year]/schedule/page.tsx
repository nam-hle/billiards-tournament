import { SchedulePageClient } from "@/components/pages/schedule-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ year: string }>;
}

export default async function TournamentSchedulePage({ params }: Props) {
	const { year } = await params;
	const schedule = await new TournamentRepository().getSchedule(year);
	const tournament = await new TournamentRepository().getByYear(year);

	return <SchedulePageClient schedule={schedule} tournament={tournament} />;
}
