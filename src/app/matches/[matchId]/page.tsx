import { MatchDetailsPage } from "@/components/pages/match-page";

// Mock types - replace with your actual types
interface Props {
	params: Promise<{ year: string; matchId: string }>;
}

export interface Player {
	id: string;
	name: string;
	wins: number;
	seed?: number;
	losses: number;
	avatar?: string;
	ranking: number;
	winRate: number;
	groupName?: string;
	totalPoints: number;
	groupPosition?: number;
	currentForm: Array<"W" | "L">;
	recentMatches: Array<{
		date: string;
		score: string;
		opponent: string;
		result: "W" | "L";
	}>;
}

export interface HeadToHeadRecord {
	player1Wins: number;
	player2Wins: number;
	totalMatches: number;
	lastMeeting?: {
		date: string;
		score: string;
		winner: string;
		tournament: string;
	};
	recentResults: Array<{
		date: string;
		score: string;
		winner: string;
		tournament: string;
	}>;
}

export interface MatchPrediction {
	player1WinChance: number;
	player2WinChance: number;
	confidence: "low" | "medium" | "high";
	factors: Array<{
		factor: string;
		description: string;
		impact: "positive" | "negative" | "neutral";
	}>;
}

export interface MatchDetails {
	id: string;
	venue: string;
	court?: string;
	scheduledAt: string;
	status: "scheduled" | "in-progress" | "completed" | "postponed";
	tournament: {
		year: string;
		name: string;
		round?: string;
		stage: "group" | "quarter" | "semi" | "final";
	};

	player1: Player;
	player2: Player;

	score?: {
		player1: number;
		player2: number;
		sets?: Array<{ player1: number; player2: number }>;
	};

	winner?: Player;
	duration?: number; // in minutes

	prediction: MatchPrediction;
	headToHead: HeadToHeadRecord;

	// Additional info
	referee?: string;
	broadcastInfo?: {
		channel: string;
		streamUrl?: string;
	};
	ticketInfo?: {
		url?: string;
		price?: string;
		available: boolean;
	};
}

// Mock repository - replace with your actual implementation
class MatchDetailsRepository {
	async getMatchDetails(year: string, matchId: string): Promise<MatchDetails> {
		return {
			id: matchId,
			venue: "Main Arena",
			status: "scheduled",
			court: "Center Court",
			scheduledAt: "2024-03-24T18:00:00",
			tournament: {
				year,
				stage: "final",
				round: "Final",
				name: "Championship Tournament"
			},

			player1: {
				id: "1",
				seed: 1,
				wins: 6,
				losses: 0,
				ranking: 1,
				winRate: 100,
				totalPoints: 21,
				groupPosition: 1,
				groupName: "Group B",
				name: "Sarah Johnson",
				currentForm: ["W", "W", "W", "W", "W"],
				avatar: "/placeholder.svg?height=80&width=80",
				recentMatches: [
					{ result: "W", score: "3-1", date: "2024-03-22", opponent: "Emma Wilson" },
					{ result: "W", score: "3-0", date: "2024-03-20", opponent: "Maria Rodriguez" },
					{ result: "W", score: "3-1", date: "2024-01-16", opponent: "Lisa Garcia" },
					{ result: "W", score: "3-0", date: "2024-01-14", opponent: "Alex Brown" },
					{ result: "W", score: "3-1", date: "2024-01-12", opponent: "David Lee" }
				]
			},

			player2: {
				id: "2",
				seed: 2,
				wins: 5,
				losses: 1,
				ranking: 2,
				winRate: 83.3,
				totalPoints: 18,
				groupPosition: 1,
				name: "John Smith",
				groupName: "Group A",
				currentForm: ["W", "W", "L", "W", "W"],
				avatar: "/placeholder.svg?height=80&width=80",
				recentMatches: [
					{ result: "W", score: "3-2", date: "2024-03-22", opponent: "Mike Davis" },
					{ result: "W", score: "3-1", date: "2024-03-20", opponent: "David Lee" },
					{ result: "L", score: "1-3", date: "2024-01-18", opponent: "Emma Wilson" },
					{ result: "W", score: "3-2", date: "2024-01-16", opponent: "Alex Brown" },
					{ result: "W", score: "3-0", date: "2024-01-14", opponent: "Lisa Garcia" }
				]
			},

			headToHead: {
				player1Wins: 2,
				player2Wins: 1,
				totalMatches: 3,
				lastMeeting: {
					score: "3-1",
					date: "2023-12-15",
					winner: "Sarah Johnson",
					tournament: "Winter Classic"
				},
				recentResults: [
					{
						score: "3-1",
						date: "2023-12-15",
						winner: "Sarah Johnson",
						tournament: "Winter Classic"
					},
					{
						score: "3-2",
						date: "2023-08-20",
						winner: "John Smith",
						tournament: "Summer Cup"
					},
					{
						score: "3-0",
						date: "2023-03-10",
						winner: "Sarah Johnson",
						tournament: "Spring Open"
					}
				]
			},

			prediction: {
				player1WinChance: 65,
				player2WinChance: 35,
				confidence: "medium",
				factors: [
					{
						impact: "positive",
						factor: "Current Form",
						description: "Sarah has won all recent matches while John has 1 recent loss"
					},
					{
						impact: "positive",
						factor: "Head-to-Head",
						description: "Sarah leads 2-1 in previous meetings"
					},
					{
						impact: "positive",
						factor: "Tournament Performance",
						description: "Sarah has a perfect record this tournament"
					},
					{
						factor: "Ranking",
						impact: "neutral",
						description: "Both players are top seeds with similar rankings"
					}
				]
			},

			referee: "Michael Thompson",
			ticketInfo: {
				available: true,
				price: "$25-75",
				url: "https://tickets.example.com"
			},
			broadcastInfo: {
				channel: "Sports Network",
				streamUrl: "https://stream.example.com/match123"
			}
		};
	}
}

export default async function MatchPage({ params }: Props) {
	const { year, matchId } = await params;
	const repo = new MatchDetailsRepository();
	const match = await repo.getMatchDetails(year, matchId);

	return <MatchDetailsPage year={year} match={match} />;
}
