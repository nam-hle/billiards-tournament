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

	const standings = await new GroupRepository().getStandings({ year, groupId });

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
						<th>Losses</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{standings.map((s) => {
						const player = players.find((p) => p.id === s.playerId);

						return (
							<tr key={s.playerId}>
								<td>{player ? player.name : s.playerId}</td>
								<td>{s.played}</td>
								<td>{s.wins}</td>
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
					</tr>
				</thead>
				<tbody>
					{matches.map((m) => {
						const p1 = players.find((p) => p.id === m.player1Id);
						const p2 = players.find((p) => p.id === m.player2Id);

						return (
							<tr key={m.id}>
								<td>{m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : "-"}</td>
								<td>{p1 ? p1.name : m.player1Id}</td>
								<td>{m.score1 != null && m.score2 != null ? `${m.score1} : ${m.score2}` : "-"}</td>
								<td>{p2 ? p2.name : m.player2Id}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</main>
	);
}
