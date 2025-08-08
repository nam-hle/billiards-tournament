import React from "react";

import { PlayerPage } from "@/components/pages/player-page";

import { PlayerRepository } from "@/repositories/player.repository";

export async function generateStaticParams() {
	const players = await new PlayerRepository().getAll();

	return players.map((player) => ({ playerId: player.id }));
}

interface Props {
	params: Promise<{ playerId: string }>;
}

export default async function OverallPlayerProfilePage({ params }: Props) {
	const { playerId } = await params;

	const playerStat = await new PlayerRepository().getOverallStat({ playerId });

	return <PlayerPage playerStat={playerStat} />;
}
