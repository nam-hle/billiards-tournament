export const Links = {
	Matches: {
		get: () => ({ label: `Matches`, href: `/matches` }),
		Match: {
			get: (matchId: string) => ({ label: `Match ${matchId}`, href: `/matches/${matchId}` })
		}
	},
	Players: {
		get: () => ({ label: `Players`, href: `/players` }),
		Player: {
			get: (playerId: string, playerName: string) => ({ label: playerName, href: `/players/${playerId}` })
		}
	},
	Tournaments: {
		get: () => ({ label: `Tournaments`, href: `/tournaments` }),
		Year: {
			Players: {
				get: (year: string) => ({ label: `Players`, href: `/tournaments/${year}/players` })
			},
			get: (year: string, tournamentName: string) => ({ label: tournamentName, href: `/tournaments/${year}` }),
			Schedule: {
				get: (year: string) => ({ label: `Schedule`, href: `/tournaments/${year}/schedule` })
			},
			Knockout: {
				get: (year: string) => ({ label: `Knockout`, href: `/tournaments/${year}/knockout` })
			},
			Groups: {
				get: (year: string) => ({ label: `Groups`, href: `/tournaments/${year}/groups` }),
				Group: {
					get: (year: string, groupId: string) => ({ label: `Group ${groupId}`, href: `/tournaments/${year}/groups/${groupId}` })
				}
			}
		}
	}
};
