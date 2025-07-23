import { assert } from "@/utils";
import { BaseRepository } from "@/repositories/base.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { type Player, CompletedMatch, DefinedPlayersMatch, type PlayerTournamentStat } from "@/interfaces";

export class PlayerRepository extends BaseRepository {
	public getAll(): Promise<Player[]> {
		return this.dataSource.getPlayers();
	}

	public async findById(id: string): Promise<Player | undefined> {
		const players = await this.getAll();

		return players.find((player) => player.id === id);
	}

	public async getById(id: string): Promise<Player> {
		const player = await this.findById(id);

		assert(player, `Player with ID ${id} not found`);

		return player;
	}

	public async getAllByYear(year: string): Promise<Player[]> {
		const players = await this.getAll();
		const groups = await new GroupRepository().getByYear({ year });
		const groupPlayers = groups.flatMap((group) => group.players);

		return players.filter((player) => groupPlayers.includes(player.id));
	}

	public async getStatsByTournament(id: string, year: string): Promise<PlayerTournamentStat> {
		const player = await this.getById(id);
		const groups = await new GroupRepository().getByYear({ year });
		const matches = (await new MatchRepository().getAllByYear({ year })).filter((match) => match.player1Id === id || match.player2Id === id);
		const completedMatches = matches.filter((match) => DefinedPlayersMatch.isInstance(match) && CompletedMatch.isInstance(match));

		const group = groups.find((group) => group.players.includes(id));
		assert(group);

		const wins = completedMatches.filter((match) => CompletedMatch.getWinnerId(match) === id).length;
		const losses = completedMatches.length - wins;

		return {
			...player,
			wins,
			group,
			losses,
			status: "active", // TODO: Determine status based on matches
			playedMatches: completedMatches.length,
			winRate: completedMatches.length > 0 ? (wins / completedMatches.length) * 100 : NaN
		};
	}
}
