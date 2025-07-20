import Path from "path";

import { assert } from "@/utils";
import { type Player } from "@/interfaces";
import { BaseRepository } from "@/repositories/base.repository";

export class PlayerRepository extends BaseRepository {
	private readonly TournamentsFilePath = Path.join(this.DataDir, "tournaments.json");

	public getAll(): Promise<Player[]> {
		return this.dataSource.getPlayers();
	}

	public async findById(id: string): Promise<Player | undefined> {
		const players = await this.getAll();

		return players.find((player) => player.id === id);
	}

	public async getById(id: string) {
		const player = this.findById(id);

		assert(player, `Player with ID ${id} not found`);

		return player;
	}
}
