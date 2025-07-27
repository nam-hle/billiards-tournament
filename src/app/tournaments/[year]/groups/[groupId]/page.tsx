import React from "react";
import { notFound } from "next/navigation";

import { GroupPage } from "@/components/pages/group-page";

import { GroupRepository } from "@/repositories/group.repository";
import { MatchRepository } from "@/repositories/match.repository";
import { TournamentRepository } from "@/repositories/tournament.repository";

export async function generateStaticParams({ params }: { params: { year: string } }) {
	if (params.year === undefined) {
		return [];
	}

	const groups = await new GroupRepository().getByYear({ year: params.year });

	return groups.map((group) => ({ groupId: group.id }));
}

interface Props {
	params: Promise<{ year: string; groupId: string }>;
}

export default async function ServerGroupPage({ params }: Props) {
	const { year, groupId } = await params;
	const tournament = await new TournamentRepository().getByYear(year);
	const group = await new GroupRepository().find({ year, groupId });

	if (!group) {
		return notFound();
	}

	const matches = await new MatchRepository().getAllMatchesByGroup({ year, groupId });
	const standings = await new GroupRepository().getStandings({ year, groupId });
	const advancedPlayerIds = (await new GroupRepository().getAdvancedPlayers({ year })).map((standing) => standing.playerId);

	return <GroupPage group={group} matches={matches} standings={standings} tournament={tournament} advancedPlayerIds={advancedPlayerIds} />;
}
