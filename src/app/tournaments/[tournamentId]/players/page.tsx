import { TournamentPlayersPageClient } from "@/components/pages/tournament-players-page";

import { GroupRepository } from "@/repositories/group.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ tournamentId: string }>;
}

export default async function TournamentPlayersPage({ params }: Props) {
	const { tournamentId } = await params;
	const tournament = await new TournamentRepository().getById({ tournamentId });
	const playerRepo = new PlayerRepository();
	const players = await playerRepo.getAllByTournament({ tournamentId });
	const playerStats = await Promise.all(players.map((player) => playerRepo.getTournamentStat({ tournamentId, playerId: player.id })));
	const groups = await new GroupRepository().getAllByTournament({ tournamentId: tournamentId });

	return <TournamentPlayersPageClient groups={groups} players={playerStats} tournament={tournament} />;
}
