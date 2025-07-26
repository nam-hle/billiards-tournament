import path from "path";
import fs from "fs/promises";
import * as Path from "node:path";
import Fs from "node:fs/promises";

import { type GroupPrediction } from "@/interfaces/prediction.interface";
import { type Match, type Group, type Player, type Tournament } from "@/interfaces";

export class DataSource {
	private readonly dataDir = path.join(process.cwd(), "src", "data");
	private readonly tournamentsFileName = "tournaments.json";
	private readonly playersFileName = "players.json";
	private readonly groupsFileName = "groups.json";
	private readonly matchesFileName = "matches.json";
	private readonly predictionsFileName = "predictions.json";

	public async getPlayers(): Promise<Player[]> {
		return this.readJSON<Player[]>(Path.join(this.dataDir, this.playersFileName));
	}

	public async getTournaments(): Promise<Tournament[]> {
		return this.readJSON<Tournament[]>(Path.join(this.dataDir, this.tournamentsFileName));
	}

	public async getGroups(params: { year: string }): Promise<Group[]> {
		const { year } = params;
		const groupsFilePath = Path.join(this.dataDir, year, this.groupsFileName);

		return this.readJSON<Group[]>(groupsFilePath);
	}

	public async getMatches(params: { year: string }): Promise<Match[]> {
		const { year } = params;
		const matchesFilePath = Path.join(this.dataDir, year, this.matchesFileName);

		return this.readJSON<Match[]>(matchesFilePath);
	}

	public async getPredictions(params: { year: string }): Promise<GroupPrediction[]> {
		const predictionsFilePath = Path.join(this.dataDir, params.year, this.predictionsFileName);

		if (!(await isPathExists(predictionsFilePath))) {
			return [];
		}

		return this.readJSON<GroupPrediction[]>(predictionsFilePath);
	}

	public async updatePredictions(params: { year: string; predictions: GroupPrediction[] }) {
		const predictionsFilePath = Path.join(this.dataDir, params.year, this.predictionsFileName);

		await this.writeJSON<GroupPrediction[]>(predictionsFilePath, params.predictions);
	}

	private async readJSON<T>(filePath: string): Promise<T> {
		const data = await fs.readFile(filePath, "utf-8");

		return JSON.parse(data).data;
	}

	private async writeJSON<T>(filePath: string, data: T): Promise<void> {
		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await fs.writeFile(filePath, JSON.stringify({ data }, null, 2), "utf-8");
	}
}

async function isPathExists(path: string): Promise<boolean> {
	try {
		await Fs.access(path);

		return true;
	} catch {
		return false;
	}
}
