export interface GroupPrediction {
	readonly groupId: string;
	top1: Record<string, number>;
	top2: Record<string, number>;
}
