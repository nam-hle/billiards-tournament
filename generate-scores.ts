import Fs from "node:fs/promises";

import Chance from "chance";

import { type Match, GroupMatch } from "@/interfaces";

const filePath = "/Users/nhle/dev/open/billiards-tournament/src/data/2025/matches.json";

async function main() {
	const file = JSON.parse(await Fs.readFile(filePath, "utf-8")) as { data: Match[] };

	const injectedScores = file.data.map((match) => {
		if (GroupMatch.isInstance(match)) {
			const player1Win = Math.random() < 0.5;

			return {
				...match,
				score1: player1Win ? 5 : Math.floor(Math.random() * 5),
				score2: player1Win ? Math.floor(Math.random() * 5) : 5,
				scheduledAt: new Chance().date({ month: 7, year: 2025 })
			};
		}

		return match;
	});

	await Fs.writeFile(
		filePath,
		JSON.stringify(
			{
				...file,
				data: injectedScores
			},
			null,
			2
		),
		"utf-8"
	);
}

main();
