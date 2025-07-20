import { notFound } from "next/navigation";

import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";

interface Props {
	params: Promise<{ year: string; groupId: string }>;
}

export default async function GroupPage({ params }: Props) {
	const { year, groupId } = await params;
	const group = await new GroupRepository().get({ year, groupId });

	if (!group) {
		return notFound();
	}

	const players = await new PlayerRepository().getAll();
	const matches = await new MatchRepository().getAllMatchGroup({ year, groupId });

	// Standings: count wins, draws, losses, points
	const standings = group.players.map((pid) => {
		let wins = 0,
			draws = 0,
			losses = 0,
			points = 0,
			played = 0;

		for (const m of matches) {
			if (m.player1Id !== pid && m.player2Id !== pid) {
				continue;
			}

			played++;

			if (m.score1 != null && m.score2 != null) {
				if (m.score1 === m.score2) {
					draws++;
					points += 1;
				} else if ((m.player1Id === pid && m.score1 > m.score2) || (m.player2Id === pid && m.score2 > m.score1)) {
					wins++;
					points += 3;
				} else {
					losses++;
				}
			}
		}

		return { pid, wins, draws, losses, points, played };
	});
	standings.sort((a, b) => b.points - a.points);

	return (
		<main>
			<h1>Group: {group.name}</h1>
			<h2>Standings</h2>
			<table>
				<thead>
					<tr>
						<th>Player</th>
						<th>Played</th>
						<th>Wins</th>
						<th>Draws</th>
						<th>Losses</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{standings.map((s) => {
						const player = players.find((p) => p.id === s.pid);

						return (
							<tr key={s.pid}>
								<td>{player ? player.name : s.pid}</td>
								<td>{s.played}</td>
								<td>{s.wins}</td>
								<td>{s.draws}</td>
								<td>{s.losses}</td>
								<td>{s.points}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<h2>Matches</h2>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Player 1</th>
						<th>Score</th>
						<th>Player 2</th>
						<th>Result</th>
					</tr>
				</thead>
				<tbody>
					{matches.map((m) => {
						const p1 = players.find((p) => p.id === m.player1Id);
						const p2 = players.find((p) => p.id === m.player2Id);
						let result = "-";

						if (m.winnerId) {
							result = m.winnerId === m.player1Id ? "P1 Win" : "P2 Win";
						} else if (m.score1 === m.score2) {
							result = "Draw";
						}

						return (
							<tr key={m.id}>
								<td>{m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : "-"}</td>
								<td>{p1 ? p1.name : m.player1Id}</td>
								<td>{m.score1 != null && m.score2 != null ? `${m.score1} : ${m.score2}` : "-"}</td>
								<td>{p2 ? p2.name : m.player2Id}</td>
								<td>{result}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</main>
	);
}
