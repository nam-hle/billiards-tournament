import { supabaseClient } from "@/services/supabase/server";
import { DEFAULT_LIMIT, TOURNAMENT_SELECT } from "@/constants";
import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { PlayerRepository } from "@/repositories/player.repository";
import {
	Match,
	GroupStanding,
	CompletedMatch,
	ScheduledMatch,
	type Tournament,
	type PlayerAchievement,
	type TournamentSummary,
	PlayerAchievementDescriptionMap
} from "@/interfaces";

export class TournamentRepository {
	public async getAll(): Promise<Tournament[]> {
		const { data, error } = await supabaseClient.from("tournaments").select(TOURNAMENT_SELECT).order("year", { ascending: false });

		if (error) {
			throw error;
		}

		return data;
	}

	public async getById(params: { tournamentId: string }): Promise<Tournament> {
		const { data, error } = await supabaseClient.from("tournaments").select(TOURNAMENT_SELECT).eq("id", params.tournamentId).single();

		if (error) {
			throw error;
		}

		return data;
	}

	public async getSummary(params: { tournamentId: string }): Promise<TournamentSummary> {
		const groupRepo = new GroupRepository();

		const tournament = await this.getById(params);
		const groups = await Promise.all((await groupRepo.getAllByTournament(params)).map(async (group) => groupRepo.getSummary({ groupId: group.id })));
		const matches = await new MatchRepository().query(params);

		const upcomingMatches = matches
			.filter((match): match is ScheduledMatch => ScheduledMatch.isInstance(match) && new Date(match.scheduledAt) > new Date())
			.slice(0, DEFAULT_LIMIT);

		const completedMatches = matches.filter(CompletedMatch.isInstance);
		const recentMatches = completedMatches.sort(ScheduledMatch.descendingComparator).slice(0, DEFAULT_LIMIT);

		const topStandings = (await Promise.all(groups.map(async (group) => new GroupRepository().getStandings({ groupId: group.id }))))
			.flat()
			.sort(GroupStanding.createComparator([]))
			.slice(0, DEFAULT_LIMIT);

		return {
			groups,
			matches,
			topStandings,
			recentMatches,
			upcomingMatches,
			completedMatches,
			players: await new PlayerRepository().getAllByTournament(params),
			status: completedMatches.length === 0 ? "upcoming" : completedMatches.length < matches.length ? "ongoing" : "completed",
			...tournament
		};
	}

	async getTournamentAchievements(params: { playerId: string; tournamentId: string }): Promise<PlayerAchievement[]> {
		const matches = await new MatchRepository().query(params);

		const tournament = await this.getById(params);

		if (!matches.every(CompletedMatch.isInstance)) {
			// TODO: We still can compute results before the tournament is completed
			return [];
		}

		const joinedMatches = matches.filter((match) => Match.hasPlayer(match, params.playerId));
		const [finalMatch, semiFinalMatch, quarterFinalMatch] = ["final", "semi-final", "quarter-final"].map((type) =>
			joinedMatches.find((match) => match.type === type)
		);

		if (finalMatch) {
			if (CompletedMatch.isWinner(finalMatch, params.playerId)) {
				return [{ ...PlayerAchievementDescriptionMap.champion, tournamentName: tournament.name }];
			}

			return [{ ...PlayerAchievementDescriptionMap["runner-up"], tournamentName: tournament.name }];
		}

		if (semiFinalMatch) {
			return [{ ...PlayerAchievementDescriptionMap["semi-finalist"], tournamentName: tournament.name }];
		}

		if (quarterFinalMatch) {
			return [{ ...PlayerAchievementDescriptionMap["quarter-finalist"], tournamentName: tournament.name }];
		}

		const groupMatch = joinedMatches.find((match) => match.type === "group");

		if (groupMatch) {
			return [{ ...PlayerAchievementDescriptionMap["group-stage"], tournamentName: tournament.name }];
		}

		return [];
	}
}
