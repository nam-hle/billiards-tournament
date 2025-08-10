export interface GroupPrediction {
	top1: Record<string, number>;
	top2: Record<string, number>;
}

export interface KnockoutPrediction {
	[playerId: string]: {
		ranksRate: Record<string, number>;
		opponentsRate: Record<string, number>;
	};
}
