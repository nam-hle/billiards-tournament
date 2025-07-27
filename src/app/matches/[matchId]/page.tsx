import { MatchDetailsPage } from "@/components/pages/match-page";

import { MatchRepository } from "@/repositories/match.repository";

export async function generateStaticParams() {
	const matches = await new MatchRepository().getAll();

	return matches.map((match) => ({ matchId: match.id }));
}

interface Props {
	params: Promise<{ matchId: string }>;
}

export default async function MatchPage({ params }: Props) {
	const { matchId } = await params;

	const match = await new MatchRepository().getDetails({ matchId });

	return <MatchDetailsPage match={match} />;
}
