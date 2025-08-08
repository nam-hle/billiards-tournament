import { CompletedMatch } from "@/interfaces";

export class Elo {
	private static readonly DEFAULT_RATING = 1500;
	private static readonly K = 32;

	static expectedScore(rA: number, rB: number): number {
		return 1 / (1 + 10 ** ((rB - rA) / 400));
	}

	public compute(playerIds: string[], matches: CompletedMatch[]): Record<string, number> {
		const ratings = Object.fromEntries(playerIds.map((playerId) => [playerId, Elo.DEFAULT_RATING]));

		for (const match of matches) {
			const winnerId = CompletedMatch.getWinnerId(match);
			const loserId = CompletedMatch.getLoserId(match);

			const winnerRating = ratings[winnerId];
			const loserRating = ratings[loserId];

			const expectedWinnerScore = Elo.expectedScore(winnerRating, loserRating);
			const expectedLoserScore = Elo.expectedScore(loserRating, winnerRating);

			ratings[winnerId] = winnerRating + Elo.K * (1 - expectedWinnerScore);
			ratings[loserId] = loserRating + Elo.K * (0 - expectedLoserScore);
		}

		return ratings;
	}
}
