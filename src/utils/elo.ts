export class Elo {
	private ratings: Record<string, number> = {};
	public static readonly DEFAULT_RATING = 1500;
	public static readonly K = 32;

	public getRatings() {
		return this.ratings;
	}

	public getRating(playerId: string): number {
		return this.ratings[playerId] ?? Elo.DEFAULT_RATING;
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
