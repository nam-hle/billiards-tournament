import React from "react";
import { notFound } from "next/navigation";

import { GroupPage } from "@/components/pages/group-page";

import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

interface Props {
	params: Promise<{ groupName: string; tournamentId: string }>;
}

export default async function ServerGroupPage({ params }: Props) {
	const { groupName, tournamentId } = await params;
	const tournament = await new TournamentRepository().getById({ tournamentId });
	const group = await new GroupRepository().findByName({ groupName, tournamentId });

	if (!group) {
		return notFound();
	}

	const matches = await new MatchRepository().query({ groupId: group.id });
	const standings = await new GroupRepository().getStandings({ prediction: true, groupId: group.id });
	const advancedPlayerIds = (await new GroupRepository().getAdvancedPlayers({ tournamentId: tournamentId })).map((standing) => standing.player.id);

	return <GroupPage group={group} matches={matches} standings={standings} tournament={tournament} advancedPlayerIds={advancedPlayerIds} />;
}
