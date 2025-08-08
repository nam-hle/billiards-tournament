import { PlayersPage } from "@/components/pages/players-page";

import { PlayerRepository } from "@/repositories/player.repository";

export default async function Page() {
	const playerRepo = new PlayerRepository();
	const players = await playerRepo.getAll();

	const previousRanks = await playerRepo.getEloRatingAndRank({ skipLast: 10 });

	const currentStats = (
		await Promise.all(
			players.map(async (player) => {
				const stats = await playerRepo.getOverallStat({ playerId: player.id });
				const previousRank = previousRanks[player.id].rank;

				return { ...stats, rankDiff: previousRank - stats.rank };
			})
		)
	).sort((a, b) => a.rank - b.rank);

	return <PlayersPage players={currentStats} />;
}
