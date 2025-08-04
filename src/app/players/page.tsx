import { PlayersPageClient } from "@/components/pages/players-page";

import { PlayerRepository } from "@/repositories/player.repository";

export default async function PlayersPage() {
	const playerRepo = new PlayerRepository();
	const players = await playerRepo.getAll();
	const previousRanks = await Promise.all(
		players.map(async (player) => {
			const ratings = await playerRepo.getEloRating({ skipLast: 10, playerId: player.id });

			return { ...ratings, playerId: player.id };
		})
	);

	const currentStats = (
		await Promise.all(
			players.map(async (player) => {
				const stats = await playerRepo.getOverallStat({ playerId: player.id });
				const previousRank = previousRanks.find((stat) => stat.playerId === player.id)?.rank;

				if (previousRank === undefined) {
					throw new Error(`Previous rank not found for player ${player.id}`);
				}

				return { ...stats, rankDiff: previousRank - stats.rank };
			})
		)
	).sort((a, b) => a.rank - b.rank);

	return <PlayersPageClient players={currentStats} />;
}
