import { TournamentsPage } from "@/components/pages/tournaments-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

export default async function Page() {
	const tournamentRepo = new TournamentRepository();
	const tournaments = await tournamentRepo.getAll();
	const tournamentSummaries = await Promise.all(tournaments.map((tournament) => tournamentRepo.getSummary({ tournamentId: tournament.id })));

	return <TournamentsPage tournaments={tournamentSummaries} />;
}
