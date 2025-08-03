export class Elo {
	private readonly ratings: Record<string, number>;
	public static readonly DEFAULT_RATING = 1500;
	public static readonly K = 32;

	public constructor(playerIds: string[]) {
		this.ratings = Object.fromEntries(playerIds.map((playerId) => [playerId, Elo.DEFAULT_RATING]));
	}

	public getRatings() {
		return this.ratings;
	}

	public getRating(playerId: string): number {
		return this.ratings[playerId];
	}

	static expectedScore(rA: number, rB: number): number {
		return 1 / (1 + 10 ** ((rB - rA) / 400));
	}

	public processMatch(winnerId: string, loserId: string): void {
		const rWinner = this.getRating(winnerId);
		const rLoser = this.getRating(loserId);

		const eWinner = Elo.expectedScore(rWinner, rLoser);
		const eLoser = Elo.expectedScore(rLoser, rWinner);

		this.ratings[winnerId] = rWinner + Elo.K * (1 - eWinner);
		this.ratings[loserId] = rLoser + Elo.K * (0 - eLoser);
	}
}
