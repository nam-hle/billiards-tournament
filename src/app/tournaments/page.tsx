import { ClientTournamentsPage } from "@/components/pages/tournaments-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

export default async function TournamentsPage() {
	const tournamentRepo = new TournamentRepository();
	const tournaments = await tournamentRepo.getAll();
	const tournamentSummaries = await Promise.all(tournaments.map((tournament) => tournamentRepo.getSummary({ tournamentId: tournament.id })));

	return <ClientTournamentsPage tournaments={tournamentSummaries} />;
}
