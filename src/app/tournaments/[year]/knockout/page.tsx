import { Crown, Trophy, MapPin, Calendar } from "lucide-react";

import { Separator } from "@/components/shadcn/separator";
import { Card, CardContent } from "@/components/shadcn/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { TournamentBracket, QualifiedPlayersList } from "@/components/tournament-knockout-page";

// Mock types - replace with your actual types
interface Props {
	params: Promise<{ year: string }>;
}

interface KnockoutPlayer {
	id: string;
	name: string;
	wins: number;
	seed: number;
	losses: number;
	avatar?: string;
	groupId: string;
	winRate: number;
	groupName: string;
	totalPoints: number;
	groupPosition: number;
}

interface KnockoutMatch {
	id: string;
	venue?: string;
	score1?: number;
	score2?: number;
	matchNumber: number;
	scheduledAt?: string;
	winner?: KnockoutPlayer;
	player1?: KnockoutPlayer;
	player2?: KnockoutPlayer;
	stage: "quarter" | "semi" | "final";
	status: "scheduled" | "in-progress" | "completed";
}

interface KnockoutData {
	year: string;
	name: string;
	venue: string;
	startDate: string;
	matches: KnockoutMatch[];
	champion?: KnockoutPlayer;
	runnerUp?: KnockoutPlayer;
	qualifiedPlayers: KnockoutPlayer[];
}

// Mock repository - replace with your actual implementation
class KnockoutRepository {
	async getKnockoutData(year: string): Promise<KnockoutData> {
		const qualifiedPlayers: KnockoutPlayer[] = [
			{
				id: "1",
				wins: 4,
				seed: 1,
				losses: 0,
				groupId: "B",
				winRate: 100,
				totalPoints: 12,
				groupPosition: 1,
				groupName: "Group B",
				name: "Sarah Johnson",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "2",
				wins: 3,
				seed: 2,
				losses: 0,
				groupId: "A",
				winRate: 100,
				totalPoints: 9,
				groupPosition: 1,
				name: "John Smith",
				groupName: "Group A",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "3",
				wins: 3,
				seed: 3,
				losses: 0,
				groupId: "C",
				winRate: 100,
				totalPoints: 9,
				groupPosition: 1,
				name: "Mike Davis",
				groupName: "Group C",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "4",
				wins: 3,
				seed: 4,
				losses: 1,
				winRate: 75,
				groupId: "D",
				totalPoints: 8,
				groupPosition: 1,
				name: "Emma Wilson",
				groupName: "Group D",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "5",
				wins: 2,
				seed: 5,
				losses: 1,
				groupId: "A",
				winRate: 66.7,
				totalPoints: 7,
				groupPosition: 2,
				name: "Alex Brown",
				groupName: "Group A",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "6",
				wins: 2,
				seed: 6,
				losses: 2,
				winRate: 50,
				groupId: "B",
				totalPoints: 6,
				groupPosition: 2,
				name: "Lisa Garcia",
				groupName: "Group B",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "7",
				wins: 2,
				seed: 7,
				losses: 2,
				winRate: 50,
				groupId: "C",
				totalPoints: 6,
				groupPosition: 2,
				name: "David Lee",
				groupName: "Group C",
				avatar: "/placeholder.svg?height=40&width=40"
			},
			{
				id: "8",
				wins: 1,
				seed: 8,
				losses: 2,
				groupId: "D",
				winRate: 33.3,
				totalPoints: 5,
				groupPosition: 2,
				groupName: "Group D",
				name: "Maria Rodriguez",
				avatar: "/placeholder.svg?height=40&width=40"
			}
		];

		return {
			year,
			qualifiedPlayers,
			venue: "Main Arena",
			startDate: "2024-03-20",
			champion: qualifiedPlayers[0], // Sarah Johnson
			runnerUp: qualifiedPlayers[1], // John Smith
			name: "Championship Tournament",
			matches: [
				// Quarter Finals
				{
					id: "qf1",
					score1: 3,
					score2: 0,
					matchNumber: 1,
					stage: "quarter",
					venue: "Court 1",
					status: "completed",
					winner: qualifiedPlayers[0],
					player1: qualifiedPlayers[0], // Sarah (1)
					player2: qualifiedPlayers[7], // Maria (8)
					scheduledAt: "2024-03-20T14:00:00"
				},
				{
					id: "qf2",
					score1: 3,
					score2: 2,
					matchNumber: 2,
					stage: "quarter",
					venue: "Court 2",
					status: "completed",
					winner: qualifiedPlayers[3],
					player1: qualifiedPlayers[3], // Emma (4)
					player2: qualifiedPlayers[4], // Alex (5)
					scheduledAt: "2024-03-20T14:00:00"
				},
				{
					id: "qf3",
					score1: 3,
					score2: 1,
					matchNumber: 3,
					stage: "quarter",
					venue: "Court 1",
					status: "completed",
					winner: qualifiedPlayers[2],
					player1: qualifiedPlayers[2], // Mike (3)
					player2: qualifiedPlayers[5], // Lisa (6)
					scheduledAt: "2024-03-20T16:00:00"
				},
				{
					id: "qf4",
					score1: 3,
					score2: 1,
					matchNumber: 4,
					stage: "quarter",
					venue: "Court 2",
					status: "completed",
					winner: qualifiedPlayers[1],
					player1: qualifiedPlayers[1], // John (2)
					player2: qualifiedPlayers[6], // David (7)
					scheduledAt: "2024-03-20T16:00:00"
				},
				// Semi Finals
				{
					id: "sf1",
					score1: 3,
					score2: 1,
					stage: "semi",
					matchNumber: 1,
					venue: "Main Court",
					status: "completed",
					winner: qualifiedPlayers[0],
					player1: qualifiedPlayers[0], // Sarah
					player2: qualifiedPlayers[3], // Emma
					scheduledAt: "2024-03-22T15:00:00"
				},
				{
					id: "sf2",
					score1: 2,
					score2: 3,
					stage: "semi",
					matchNumber: 2,
					venue: "Main Court",
					status: "completed",
					winner: qualifiedPlayers[1],
					player1: qualifiedPlayers[2], // Mike
					player2: qualifiedPlayers[1], // John
					scheduledAt: "2024-03-22T17:00:00"
				},
				// Final
				{
					score1: 3,
					score2: 2,
					id: "final",
					stage: "final",
					matchNumber: 1,
					venue: "Main Arena",
					status: "completed",
					winner: qualifiedPlayers[0],
					player1: qualifiedPlayers[0], // Sarah
					player2: qualifiedPlayers[1], // John
					scheduledAt: "2024-03-24T18:00:00"
				}
			]
		};
	}
}

export default async function TournamentKnockoutPage({ params }: Props) {
	const { year } = await params;
	const repo = new KnockoutRepository();
	const data = await repo.getKnockoutData(year);

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<div className="space-y-4 text-center">
				<div className="flex items-center justify-center gap-3">
					<Crown className="h-8 w-8 text-yellow-600" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Knockout Phase</h1>
						<p className="text-xl text-muted-foreground">
							{data.name} - {data.year}
						</p>
					</div>
				</div>

				<div className="flex justify-center gap-8 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Starts {new Date(data.startDate).toLocaleDateString()}
					</div>
					<div className="flex items-center gap-1">
						<MapPin className="h-4 w-4" />
						{data.venue}
					</div>
				</div>
			</div>

			<Separator />

			{/* Champion Banner */}
			{data.champion && (
				<Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
					<CardContent className="pt-6">
						<div className="flex items-center justify-center gap-4">
							<Crown className="h-8 w-8 text-yellow-600" />
							<div className="text-center">
								<h2 className="text-2xl font-bold text-yellow-800">Tournament Champion</h2>
								<div className="mt-2 flex items-center justify-center gap-3">
									<Avatar className="h-12 w-12">
										<AvatarImage alt={data.champion.name} src={data.champion.avatar || "/placeholder.svg"} />
										<AvatarFallback>
											{data.champion.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-xl font-semibold text-yellow-800">{data.champion.name}</p>
										<p className="text-sm text-yellow-600">Defeated {data.runnerUp?.name} in the final</p>
									</div>
								</div>
							</div>
							<Trophy className="h-8 w-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>
			)}

			{/* Tournament Bracket */}
			<div>
				<h2 className="mb-6 text-2xl font-semibold">Tournament Bracket</h2>
				<TournamentBracket matches={data.matches} />
			</div>

			<Separator />

			{/* Qualified Players */}
			<QualifiedPlayersList players={data.qualifiedPlayers} />
		</div>
	);
}
