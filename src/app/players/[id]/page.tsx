import { notFound } from "next/navigation";

import { PlayerRepository } from "@/repositories/player.repository";

interface Props {
	params: { id: string };
}

export default async function PlayerProfilePage({ params }: Props) {
	const player = await new PlayerRepository().findById(params.id);

	if (!player) {
		return notFound();
	}

	// Find all matches for this player (all years)
	// const matches = await DataSource.getMatches();
	// const playerMatches = matches.filter((m) => m.player1Id === id || m.player2Id === id);

	// Group matches by year
	// const tournaments = await DataSource.getTournaments();
	// const matchesByYear: Record<string, typeof playerMatches> = {};

	// for (const match of playerMatches) {
	// 	// Find tournament year by match.scheduledAt (assume year in date string)
	// 	const year = match.scheduledAt ? new Date(match.scheduledAt).getFullYear() : "Unknown";
	//
	// 	if (!matchesByYear[year]) {
	// 		matchesByYear[year] = [];
	// 	}
	//
	// 	matchesByYear[year].push(match);
	// }

	return (
		<main>
			<h1>
				Player Profile: {player.name} {player.nickname && <span>({player.nickname})</span>}
			</h1>
			<h2>Multi-year Stats</h2>
			{/*{Object.keys(matchesByYear).length === 0 ? (*/}
			{/*	<p>No matches found for this player.</p>*/}
			{/*) : (*/}
			{/*	Object.entries(matchesByYear).map(([year, matches]) => (*/}
			{/*		<section key={year} style={{ marginBottom: 24 }}>*/}
			{/*			<h3>{year}</h3>*/}
			{/*			<table>*/}
			{/*				<thead>*/}
			{/*					<tr>*/}
			{/*						<th>Opponent</th>*/}
			{/*						<th>Score</th>*/}
			{/*						<th>Result</th>*/}
			{/*					</tr>*/}
			{/*				</thead>*/}
			{/*				<tbody>*/}
			{/*					{matches.map((match) => {*/}
			{/*						const opponentId = match.player1Id === id ? match.player2Id : match.player1Id;*/}
			{/*						const opponent = players.find((p) => p.id === opponentId);*/}
			{/*						const isWinner = match.winnerId === id;*/}
			{/*						const isDraw = match.score1 === match.score2;*/}
			{/*						let result = "-";*/}

			{/*						if (match.winnerId) {*/}
			{/*							result = isWinner ? "Win" : "Loss";*/}
			{/*						} else if (isDraw) {*/}
			{/*							result = "Draw";*/}
			{/*						}*/}

			{/*						return (*/}
			{/*							<tr key={match.id}>*/}
			{/*								<td>{opponent ? opponent.name : opponentId}</td>*/}
			{/*								<td>*/}
			{/*									{match.player1Id === id*/}
			{/*										? `${match.score1 ?? "-"} : ${match.score2 ?? "-"}`*/}
			{/*										: `${match.score2 ?? "-"} : ${match.score1 ?? "-"}`}*/}
			{/*								</td>*/}
			{/*								<td>{result}</td>*/}
			{/*							</tr>*/}
			{/*						);*/}
			{/*					})}*/}
			{/*				</tbody>*/}
			{/*			</table>*/}
			{/*		</section>*/}
			{/*	))*/}
			{/*)}*/}
		</main>
	);
}
