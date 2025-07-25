export class Elo {
	private ratings: Record<string, number> = {};
	private readonly K: number;
	private readonly defaultRating: number;

	constructor(initialRating = 1500, K = 32) {
		this.K = K;
		this.defaultRating = initialRating;
	}

	public getRating(playerId: string): number {
		return this.ratings[playerId] ?? this.defaultRating;
	}

	private expectedScore(rA: number, rB: number): number {
		return 1 / (1 + 10 ** ((rB - rA) / 400));
	}

	public processMatch(winnerId: string, loserId: string): void {
		const rWinner = this.getRating(winnerId);
		const rLoser = this.getRating(loserId);

		const eWinner = this.expectedScore(rWinner, rLoser);
		const eLoser = this.expectedScore(rLoser, rWinner);

		this.ratings[winnerId] = rWinner + this.K * (1 - eWinner);
		this.ratings[loserId] = rLoser + this.K * (0 - eLoser);
	}
}
