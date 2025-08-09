import React from "react";
import { notFound } from "next/navigation";

import { GroupPage } from "@/components/pages/group-page";

import { MatchRepository } from "@/repositories/match.repository";
import { GroupRepository } from "@/repositories/group.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ groupName: string; tournamentId: string }>;
}

export default async function ServerGroupPage({ params }: Props) {
	const { groupName, tournamentId } = await params;
	const group = await new GroupRepository().findByName({ groupName, tournamentId });

	if (!group) {
		return notFound();
	}

	const advancedPlayers = new GroupRepository().getAdvancedPlayers({ tournamentId: tournamentId });
	const tournament = new TournamentRepository().getById({ tournamentId });
	const standings = new GroupRepository().getStandings({ groupId: group.id });
	const matches = new MatchRepository().query({ groupId: group.id });
	const prediction = new GroupRepository().getPrediction({ groupId: group.id });

	return (
		<GroupPage
			matches={matches}
			groupName={groupName}
			standings={standings}
			tournament={tournament}
			predictions={prediction}
			advancedPlayers={advancedPlayers}
		/>
	);
}
