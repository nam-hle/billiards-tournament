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
		Tournament: {
			Players: {
				get: (tournamentId: string) => ({ label: `Players`, href: `/tournaments/${tournamentId}/players` })
			},
			get: (tournamentId: string, tournamentName: string) => ({ label: tournamentName, href: `/tournaments/${tournamentId}` }),
			Schedule: {
				get: (tournamentId: string) => ({ label: `Schedule`, href: `/tournaments/${tournamentId}/schedule` })
			},
			Knockout: {
				get: (tournamentId: string) => ({ label: `Knockout`, href: `/tournaments/${tournamentId}/knockout` })
			},
			Groups: {
				get: (tournamentId: string) => ({ label: `Groups`, href: `/tournaments/${tournamentId}/groups` }),
				Group: {
					get: (tournamentId: string, groupName: string) => ({
						label: `Group ${groupName}`,
						href: `/tournaments/${tournamentId}/groups/${groupName}`
					})
				}
			}
		}
	}
};
