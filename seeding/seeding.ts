import Path from "path";
import Fs from "node:fs/promises";

import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/database.types";
import { type Player, type Tournament } from "@/interfaces";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseClient = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

interface Group {
	id: string;
	name: string;
	players: string[];
}

interface Match {
	id: string;
	type: string;
	order?: number;
	groupId: string;
	score1?: number;
	score2?: number;
	player1Id?: string;
	player2Id?: string;
	scheduledAt?: string;
	placeholder2?: string;
	placeholder1?: string;
}

const dataDir = Path.join(__dirname, "..", "src", "data");

async function readJsonFile<T>(filePath: string): Promise<T[]> {
	const content = await Fs.readFile(filePath, "utf-8");

	return JSON.parse(content).data as T[];
}

async function seedTournaments() {
	const tournamentsFile = Path.join(dataDir, "tournaments.json");
	const tournaments = await readJsonFile<Tournament>(tournamentsFile);

	const values = tournaments.map(
		(t) => `('${t.id}', '${t.name}', '${t.year}', '${t.description}', '${t.venue}', '${t.image}', '${t.startTime}', '${t.endTime}')`
	);

	const sql = `INSERT INTO tournaments (id, name, year, description, venue, image, start_time, end_time)\nVALUES\n${values.join(",\n")};`;

	await Fs.writeFile(Path.join(__dirname, "tournaments.sql"), sql, "utf-8");
}

// seedTournaments();

async function seedGroups() {
	const values: string[] = [];

	for (const year of ["2024", "2025"]) {
		const groupsFile = Path.join(dataDir, year, "groups.json");
		const groups = await readJsonFile<Group>(groupsFile);

		for (const group of groups) {
			values.push(`('${year}', '${group.name.split(" ")[1]}')`);
		}
	}

	const sql = `INSERT INTO groups (tournament_id, name)\nVALUES\n${values.join(",\n")};`;

	await Fs.writeFile(Path.join(__dirname, `groups.sql`), sql, "utf-8");
}

function orNull(value: string | null | undefined): string {
	return value ? `'${value}'` : "NULL";
}

// seedGroups();

async function seedPlayers() {
	const playersFile = Path.join(dataDir, "players.json");
	const players = await readJsonFile<Player>(playersFile);

	const values = players.map((p) => `('${p.id}', '${p.name}', ${orNull(p.nickname)})`);

	const sql = `INSERT INTO players (id, name, nickname)\nVALUES\n${values.join(",\n")};`;

	await Fs.writeFile(Path.join(__dirname, "players.sql"), sql, "utf-8");
}

// seedPlayers();

async function seedGroupPlayers() {
	const persistedGroups = await supabaseClient.from("groups").select("*");

	const values: string[] = [];

	for (const year of ["2024", "2025"]) {
		const groupsFile = Path.join(dataDir, year, "groups.json");
		const groups = await readJsonFile<Group>(groupsFile);

		for (const group of groups) {
			for (const player of group.players) {
				const persistedGroup = persistedGroups.data?.find((g) => `Group ${g.name}` === group.name && g.tournament_id === year);

				if (!persistedGroup) {
					throw new Error(`Group ${group.name} not found for year ${year}`);
				}

				values.push(`('${persistedGroup.id}', '${player}')`);
			}
		}
	}

	const sql = `INSERT INTO group_players (group_id, player_id)\nVALUES\n${values.join(",\n")};`;

	await Fs.appendFile(Path.join(__dirname, `group-players.sql`), sql + "\n", "utf-8");
}

// seedGroupPlayers();

async function generateMatches() {
	const values: string[] = [];
	const persistedGroups = await supabaseClient.from("groups").select("*");

	let id = 0;

	for (const year of ["2024", "2025"]) {
		const matchesFile = Path.join(dataDir, year, "matches.json");
		const matches = await readJsonFile<Match>(matchesFile);

		for (const match of matches) {
			const persistedGroup = persistedGroups.data?.find((g) => g.name === match.groupId && g.tournament_id === year);

			const scheduledAt = match.scheduledAt ? `'${match.scheduledAt}'` : "NULL";
			const score1 = match.score1 ?? "NULL";
			const score2 = match.score2 ?? "NULL";

			values.push(
				`('${id++}', '${year}', ${orNull(persistedGroup?.id)}, '${match.type}', ${orNull(match.player1Id)}, ${orNull(match.player2Id)}, ${score1}, ${score2}, ${orNull(match.placeholder1)}, ${orNull(match.placeholder2)}, ${scheduledAt})`
			);
		}
	}

	const sql = `INSERT INTO matches (id, tournament_id, group_id, type, player_id_1, player_id_2, score_1, score_2, placeholder_1, placeholder_2, scheduled_at)\nVALUES\n${values.join(",\n")};`;

	await Fs.writeFile(Path.join(__dirname, `matches.sql`), sql, "utf-8");
}

generateMatches();
