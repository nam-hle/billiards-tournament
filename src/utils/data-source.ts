import path from "path";
import fs from "fs/promises";
import * as Path from "node:path";

import { type Match, type Group, type Player, type Tournament } from "@/interfaces";

export class DataSource {
	private readonly dataDir = path.join(process.cwd(), "src", "data");
	private readonly tournamentsFileName = "tournaments.json";
	private readonly playersFileName = "players.json";
	private readonly groupsFileName = "groups.json";
	private readonly matchesFileName = "matches.json";

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

	//
	// static async getMatches(year: string): Promise<Match[]> {
	// 	return this.readJSON<Match[]>(Path.join(DataSource.dataDir, year, "matches.json"));
	// }
	//
	// static async getGroups(year: string): Promise<Group[]> {
	// 	return this.readJSON<Group[]>(Path.resolve(DataSource.getTournamentFolder(year), "groups.json"));
	// }
	//
	// static async getParticipants(year: string): Promise<Player[]> {
	// 	const participants = await this.readJSON<{ year: number; playerId: string }[]>(`participants-${year}.json`);
	// 	const players = await this.getPlayers();
	//
	// 	return players.filter((p) => participants.some((pt) => pt.playerId === p.id));
	// }
	//
	// static async getPlayerPerformance(year: string, playerId: string) {
	// 	const matches = await this.getMatches(year);
	//
	// 	return matches.filter((m) => m.player1Id === playerId || m.player2Id === playerId);
	// }

	// static async getSchedule(year: number): Promise<Match[]> {
	// 	// In a real app, filter by year
	// 	return this.getMatches();
	// }

	// static async getGroupsForYear(year: number): Promise<Group[]> {
	// 	// In a real app, filter by year
	// 	return this.getGroups();
	// }

	// static async getGroupById(year: string, groupId: string): Promise<Group | undefined> {
	// 	const groups = await this.getGroups(year);
	//
	// 	return groups.find((g) => g.id === groupId);
	// }
	//
	// static async getMatchesForGroup(year: string, groupId: string): Promise<Match[]> {
	// 	const matches = await this.getMatches(year);
	//
	// 	return matches.filter((m) => m.groupId === groupId);
	// }

	private async readJSON<T>(filePath: string): Promise<T> {
		const data = await fs.readFile(filePath, "utf-8");

		return JSON.parse(data).data;
	}
}
