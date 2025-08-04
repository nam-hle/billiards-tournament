export interface GroupPrediction {
	top1: Record<string, number>;
	top2: Record<string, number>;
}
