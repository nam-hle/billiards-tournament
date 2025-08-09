import { MatchPage } from "@/components/pages/match-page";

import { MatchRepository } from "@/repositories/match.repository";

interface Props {
	params: Promise<{ matchId: string }>;
}

export default async function Page({ params }: Props) {
	const { matchId } = await params;

	const matchDetails = await new MatchRepository().getDetails({ matchId });

	return <MatchPage matchDetails={matchDetails} />;
}
