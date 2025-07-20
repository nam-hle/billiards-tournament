import Path from "path";

import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";

export class TournamentRepository extends BaseRepository {
	private readonly TournamentsFilePath = Path.join(this.DataDir, "tournaments.json");

	public getAll() {
		return this.dataSource.getTournaments();
	}

	public async findByYear(year: string) {
		const tournaments = await this.getAll();

		return tournaments.find((tournament) => tournament.year === year);
	}

	public async getByYear(year: string) {
		const tournament = this.findByYear(year);

		assert(tournament, `Tournament for year ${year} not found`);

		return tournament;
	}
}
