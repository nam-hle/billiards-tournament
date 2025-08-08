import { MatchesPage } from "@/components/pages/matches-page";

import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

export default async function Page() {
	const matches = await new MatchRepository().query();
	const tournaments = await new TournamentRepository().getAll();
	const players = await new PlayerRepository().getAll();

	return <MatchesPage matches={matches} players={players} tournaments={tournaments} />;
}
