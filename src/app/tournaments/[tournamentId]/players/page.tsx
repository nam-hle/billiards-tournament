import { TournamentPlayersPage } from "@/components/pages/tournament-players-page";

import { GroupRepository } from "@/repositories/group.repository";
import { PlayerRepository } from "@/repositories/player.repository";
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
	const tournament = await new TournamentRepository().getById({ tournamentId });
	const playerStats = await new PlayerRepository().getTournamentStats({ tournamentId });
	const groups = await new GroupRepository().getAllByTournament({ tournamentId: tournamentId });

	return <TournamentPlayersPage groups={groups} players={playerStats} tournament={tournament} />;
}
