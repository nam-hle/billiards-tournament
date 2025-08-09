import React from "react";

import { PlayerPage } from "@/components/pages/player-page";

import { PlayerRepository } from "@/repositories/player.repository";

interface Props {
	params: Promise<{ playerId: string }>;
}

export default async function Page({ params }: Props) {
	const { playerId } = await params;

	const playerStat = await new PlayerRepository().getOverallStat({ playerId });

	return <PlayerPage playerStat={playerStat} />;
}
