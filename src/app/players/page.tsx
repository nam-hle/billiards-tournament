import { PlayersPageClient } from "@/components/pages/players-page";

import { PlayerRepository } from "@/repositories/player.repository";

export default async function PlayersPage() {
	const playerRepo = new PlayerRepository();
	const players = await playerRepo.getAll();
	const playerStats = await Promise.all(players.map((player) => playerRepo.getStat({ playerId: player.id })));

	return <PlayersPageClient players={playerStats} />;
}
