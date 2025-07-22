import { ClientTournamentsPage } from "@/components/tournaments-page";

import { TournamentRepository } from "@/repositories/tournament.repository";

export default async function TournamentsPage() {
	const tournamentRepo = new TournamentRepository();
	const tournaments = await tournamentRepo.getAll();
	const overview = await Promise.all(
		tournaments.map(async (tournament) => {
			const tournamentData = await tournamentRepo.getData(tournament.year);

			return tournamentData.overview;
		})
	);

	return <ClientTournamentsPage tournamentOverviews={overview} />;
}
