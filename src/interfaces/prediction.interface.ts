export interface GroupPrediction {
	top1: Record<string, number>;
	top2: Record<string, number>;
}

export interface KnockoutPrediction {
	[playerId: string]:
		| {
				advancedRate: number;
				opponentsRate: Record<string, number>;
				positionsRate: Record<string, number>;
		  }
		| undefined;
}
