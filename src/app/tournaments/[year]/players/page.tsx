import { TournamentPlayersPageClient } from "@/components/pages/tournament-players-page";

import { GroupRepository } from "@/repositories/group.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

export async function generateStaticParams() {
	const tournaments = await new TournamentRepository().getAll();

	return tournaments.map((tournament) => ({ year: tournament.year }));
}

interface Props {
	params: Promise<{ year: string }>;
}

export default async function TournamentPlayersPage({ params }: Props) {
	const { year } = await params;
	const tournament = await new TournamentRepository().getByYear(year);
	const playerRepo = new PlayerRepository();
	const players = await playerRepo.getAllByYear(year);
	const playerStats = await Promise.all(players.map((player) => playerRepo.getStatsByTournament(player.id, year)));
	const groups = await new GroupRepository().getByYear({ year });

	return <TournamentPlayersPageClient groups={groups} players={playerStats} tournament={tournament} />;
}
