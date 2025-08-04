export const DEFAULT_LIMIT = 5;
export const DEFAULT_PAGE_NUMBER = 1;
export const QUARTER_FINALIST_NUM = 8;

export const COOKIE_NAME = "billiards_token";
export const COOKIE_VALUE = "access_granted";

export const ALL_FILTER = "all";

export const TOURNAMENT_SELECT = `
		id,
		name,
		year,
		venue,
		image,
		description,
		googleMapsUrl:map_url,
		startTime:start_time,
		endTime:end_time
` as const;

export const GROUP_SELECT = `
    id,
    tournament_id,
    name,
    group_players (player:players (*))
` as const;

export const MATCH_SELECT = `
		id,
		type,
		order,
		scheduledAt:scheduled_at,
		score1:score_1,
		score2:score_2,
		placeholder1:placeholder_1,
		placeholder2:placeholder_2,
		groupId:group_id,
		group:groups (id, name),
		tournament:tournaments (${TOURNAMENT_SELECT}),
		player1:players!player_id_1 (id, nickname, name),
		player2:players!player_id_2 (id, nickname, name)
		` as const;
