"use client"

import Link from "next/link"
import { useState } from "react"
import { Users, Medal, Trophy, Search, Filter, Target, ArrowRight } from "lucide-react"

import { Badge } from "@/components/shadcn/badge"
import { Input } from "@/components/shadcn/input"
import { Button } from "@/components/shadcn/button"
import { Separator } from "@/components/shadcn/separator"
import { Card, CardContent } from "@/components/shadcn/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/shadcn/tabs"
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table"
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select"

interface Props {
	params: Promise<{ year: string }>
}

interface Player {
	id: string
	name: string
	wins: number
	email: string
	losses: number
	points: number
	avatar?: string
	groupId: string
	winRate: number
	groupName: string
	joinedDate: string
	matchesPlayed: number
	status: "active" | "eliminated" | "qualified"
	recentMatches: Array<{
		id: string
		date: string
		score: string
		opponent: string
		result: "win" | "loss"
	}>
}

interface TournamentPlayers {
	year: string
	name: string
	players: Player[]
	totalMatches: number
	groups: Array<{ id: string; name: string }>
}

// Mock repository - replace with your actual implementation
class PlayersRepository {
	async getTournamentPlayers(year: string): Promise<TournamentPlayers> {
		return {
			year,
			totalMatches: 24,
			name: "Championship Tournament",
			groups: [
				{ id: "A", name: "Group A" },
				{ id: "B", name: "Group B" },
				{ id: "C", name: "Group C" },
				{ id: "D", name: "Group D" },
			],
			players: [
				{
					id: "1",
					wins: 3,
					losses: 0,
					points: 9,
					groupId: "A",
					winRate: 100,
					matchesPlayed: 3,
					status: "active",
					name: "John Smith",
					groupName: "Group A",
					joinedDate: "2024-01-10",
					email: "john.smith@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [
						{ id: "1", score: "3-1", result: "win", date: "2024-01-15", opponent: "Sarah Johnson" },
						{ id: "2", score: "3-0", result: "win", date: "2024-01-12", opponent: "Mike Davis" },
						{ id: "3", score: "3-2", result: "win", date: "2024-01-10", opponent: "Emma Wilson" },
					],
				},
				{
					id: "2",
					wins: 4,
					losses: 0,
					points: 12,
					groupId: "B",
					winRate: 100,
					matchesPlayed: 4,
					status: "qualified",
					groupName: "Group B",
					name: "Sarah Johnson",
					joinedDate: "2024-01-08",
					email: "sarah.johnson@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [
						{ id: "4", score: "3-0", result: "win", date: "2024-01-16", opponent: "Alex Brown" },
						{ id: "5", score: "3-1", result: "win", date: "2024-01-14", opponent: "Lisa Garcia" },
						{ id: "6", score: "3-2", result: "win", date: "2024-01-11", opponent: "David Lee" },
					],
				},
				{
					id: "3",
					wins: 2,
					losses: 0,
					points: 6,
					groupId: "C",
					winRate: 100,
					matchesPlayed: 2,
					status: "active",
					name: "Mike Davis",
					groupName: "Group C",
					joinedDate: "2024-01-09",
					email: "mike.davis@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [
						{ id: "7", score: "3-1", result: "win", date: "2024-01-13", opponent: "James Wilson" },
						{ id: "8", score: "3-0", result: "win", date: "2024-01-11", opponent: "Anna Taylor" },
					],
				},
				{
					id: "4",
					wins: 2,
					losses: 1,
					points: 6,
					groupId: "A",
					winRate: 66.7,
					matchesPlayed: 3,
					status: "active",
					name: "Emma Wilson",
					groupName: "Group A",
					joinedDate: "2024-01-07",
					email: "emma.wilson@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [
						{ id: "9", score: "2-3", result: "loss", date: "2024-01-15", opponent: "John Smith" },
						{ id: "10", score: "3-1", result: "win", date: "2024-01-13", opponent: "Alex Brown" },
						{ id: "11", score: "3-0", result: "win", date: "2024-01-10", opponent: "Lisa Garcia" },
					],
				},
				{
					id: "5",
					wins: 1,
					losses: 2,
					points: 3,
					groupId: "B",
					winRate: 33.3,
					matchesPlayed: 3,
					status: "active",
					name: "Alex Brown",
					groupName: "Group B",
					joinedDate: "2024-01-06",
					email: "alex.brown@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [
						{ id: "12", score: "0-3", result: "loss", date: "2024-01-16", opponent: "Sarah Johnson" },
						{ id: "13", score: "1-3", result: "loss", date: "2024-01-13", opponent: "Emma Wilson" },
						{ id: "14", score: "3-2", result: "win", date: "2024-01-10", opponent: "David Lee" },
					],
				},
				{
					id: "6",
					wins: 1,
					losses: 1,
					points: 3,
					winRate: 50,
					groupId: "C",
					matchesPlayed: 2,
					status: "active",
					name: "Lisa Garcia",
					groupName: "Group C",
					joinedDate: "2024-01-05",
					email: "lisa.garcia@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [
						{ id: "15", score: "1-3", result: "loss", date: "2024-01-14", opponent: "Sarah Johnson" },
						{ id: "16", score: "3-1", result: "win", date: "2024-01-11", opponent: "James Wilson" },
					],
				},
				{
					id: "7",
					wins: 0,
					losses: 1,
					points: 0,
					winRate: 0,
					groupId: "D",
					matchesPlayed: 1,
					name: "David Lee",
					groupName: "Group D",
					status: "eliminated",
					joinedDate: "2024-01-04",
					email: "david.lee@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
					recentMatches: [{ id: "17", score: "2-3", result: "loss", date: "2024-01-10", opponent: "Alex Brown" }],
				},
				{
					id: "8",
					wins: 0,
					losses: 0,
					points: 0,
					winRate: 0,
					groupId: "D",
					matchesPlayed: 0,
					status: "active",
					recentMatches: [],
					groupName: "Group D",
					name: "Maria Rodriguez",
					joinedDate: "2024-01-03",
					email: "maria.rodriguez@email.com",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			],
		}
	}
}

function PlayerCard({ year, player }: { year: string; player: Player; }) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "qualified":
				return "bg-green-100 text-green-800"
			case "active":
				return "bg-blue-100 text-blue-800"
			case "eliminated":
				return "bg-red-100 text-red-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case "qualified":
				return "Qualified"
			case "active":
				return "Active"
			case "eliminated":
				return "Eliminated"
			default:
				return "Unknown"
		}
	}

	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardContent className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12">
							<AvatarImage alt={player.name} src={player.avatar || "/placeholder.svg"} />
							<AvatarFallback>
								{player.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-semibold text-lg">{player.name}</h3>
							<p className="text-sm text-muted-foreground">{player.email}</p>
						</div>
					</div>
					<Badge className={getStatusColor(player.status)}>{getStatusText(player.status)}</Badge>
				</div>

				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Badge variant="outline">{player.groupName}</Badge>
						<div className="text-right">
							<p className="text-2xl font-bold">{player.points}</p>
							<p className="text-xs text-muted-foreground">Points</p>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<p className="text-lg font-semibold">{player.matchesPlayed}</p>
							<p className="text-xs text-muted-foreground">Played</p>
						</div>
						<div>
							<p className="text-lg font-semibold text-green-600">{player.wins}</p>
							<p className="text-xs text-muted-foreground">Wins</p>
						</div>
						<div>
							<p className="text-lg font-semibold text-red-600">{player.losses}</p>
							<p className="text-xs text-muted-foreground">Losses</p>
						</div>
					</div>

					<div className="pt-2">
						<div className="flex justify-between text-sm mb-1">
							<span>Win Rate</span>
							<span>{player.winRate.toFixed(1)}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div style={{ width: `${player.winRate}%` }} className="bg-green-500 h-2 rounded-full transition-all" />
						</div>
					</div>

					<Button asChild variant="outline" className="w-full bg-transparent">
						<Link className="flex items-center gap-2" href={`/tournaments/${year}/players/${player.id}`}>
							View Profile
							<ArrowRight className="h-4 w-4" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

function PlayersTable({ year, players }: { year: string; players: Player[]; }) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "qualified":
				return "bg-green-100 text-green-800"
			case "active":
				return "bg-blue-100 text-blue-800"
			case "eliminated":
				return "bg-red-100 text-red-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case "qualified":
				return "Qualified"
			case "active":
				return "Active"
			case "eliminated":
				return "Eliminated"
			default:
				return "Unknown"
		}
	}

	return (
		<Card>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">Rank</TableHead>
							<TableHead>Player</TableHead>
							<TableHead>Group</TableHead>
							<TableHead className="text-center">Played</TableHead>
							<TableHead className="text-center">Wins</TableHead>
							<TableHead className="text-center">Losses</TableHead>
							<TableHead className="text-center">Points</TableHead>
							<TableHead className="text-center">Win Rate</TableHead>
							<TableHead className="text-center">Status</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{players
							.sort((a, b) => b.points - a.points || b.winRate - a.winRate)
							.map((player, index) => (
								<TableRow key={player.id}>
									<TableCell>
										<Badge
											variant={index < 3 ? "default" : "outline"}
											className="w-6 h-6 p-0 flex items-center justify-center text-xs"
										>
											{index + 1}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage alt={player.name} src={player.avatar || "/placeholder.svg"} />
												<AvatarFallback className="text-xs">
													{player.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium">{player.name}</p>
												<p className="text-xs text-muted-foreground">{player.email}</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline">{player.groupName}</Badge>
									</TableCell>
									<TableCell className="text-center">{player.matchesPlayed}</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-green-100 text-green-800">
											{player.wins}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="secondary" className="bg-red-100 text-red-800">
											{player.losses}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge variant="default" className="font-semibold">
											{player.points}
										</Badge>
									</TableCell>
									<TableCell className="text-center">{player.winRate.toFixed(1)}%</TableCell>
									<TableCell className="text-center">
										<Badge className={getStatusColor(player.status)}>{getStatusText(player.status)}</Badge>
									</TableCell>
									<TableCell>
										<Button asChild size="sm" variant="outline">
											<Link href={`/tournaments/${year}/players/${player.id}`}>View</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

export default async function TournamentPlayersPage({ params }: Props) {
	const { year } = await params
	const repo = new PlayersRepository()
	const data = await repo.getTournamentPlayers(year)

	return <PlayersPageClient data={data} year={year} />
}

function PlayersPageClient({ data, year }: { year: string; data: TournamentPlayers; }) {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedGroup, setSelectedGroup] = useState("all")
	const [selectedStatus, setSelectedStatus] = useState("all")
	const [sortBy, setSortBy] = useState("points")

	// Filter and sort players
	const filteredPlayers = data.players
		.filter((player) => {
			const matchesSearch =
				player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				player.email.toLowerCase().includes(searchTerm.toLowerCase())
			const matchesGroup = selectedGroup === "all" || player.groupId === selectedGroup
			const matchesStatus = selectedStatus === "all" || player.status === selectedStatus

			return matchesSearch && matchesGroup && matchesStatus
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "points":
					return b.points - a.points || b.winRate - a.winRate
				case "wins":
					return b.wins - a.wins
				case "winRate":
					return b.winRate - a.winRate
				case "name":
					return a.name.localeCompare(b.name)
				default:
					return 0
			}
		})

	const totalPlayers = data.players.length
	const activePlayers = data.players.filter((p) => p.status === "active").length
	const qualifiedPlayers = data.players.filter((p) => p.status === "qualified").length
	const eliminatedPlayers = data.players.filter((p) => p.status === "eliminated").length

	return (
		<div className="container mx-auto py-8 space-y-8">
			{/* Header */}
			<div className="text-center space-y-4">
				<div className="flex items-center justify-center gap-3">
					<Users className="h-8 w-8 text-primary" />
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Tournament Players</h1>
						<p className="text-xl text-muted-foreground">
							{data.name} - {data.year}
						</p>
					</div>
				</div>
			</div>

			<Separator />

			{/* Player Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Users className="h-4 w-4 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{totalPlayers}</p>
								<p className="text-xs text-muted-foreground">Total Players</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="p-2 bg-green-100 rounded-lg">
								<Trophy className="h-4 w-4 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{qualifiedPlayers}</p>
								<p className="text-xs text-muted-foreground">Qualified</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="p-2 bg-yellow-100 rounded-lg">
								<Target className="h-4 w-4 text-yellow-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{activePlayers}</p>
								<p className="text-xs text-muted-foreground">Active</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-2">
							<div className="p-2 bg-red-100 rounded-lg">
								<Medal className="h-4 w-4 text-red-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">{eliminatedPlayers}</p>
								<p className="text-xs text-muted-foreground">Eliminated</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap gap-4 items-center">
						<div className="flex items-center gap-2">
							<Search className="h-4 w-4 text-muted-foreground" />
							<Input
								value={searchTerm}
								className="w-[250px]"
								placeholder="Search players..."
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm font-medium">Filters:</span>
						</div>

						<Select value={selectedGroup} onValueChange={setSelectedGroup}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="All Groups" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Groups</SelectItem>
								{data.groups.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={selectedStatus} onValueChange={setSelectedStatus}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="All Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="qualified">Qualified</SelectItem>
								<SelectItem value="eliminated">Eliminated</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="points">Points</SelectItem>
								<SelectItem value="wins">Wins</SelectItem>
								<SelectItem value="winRate">Win Rate</SelectItem>
								<SelectItem value="name">Name</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Players Display */}
			<Tabs defaultValue="table" className="space-y-6">
				<TabsList>
					<TabsTrigger value="table">Table View</TabsTrigger>
					<TabsTrigger value="cards">Card View</TabsTrigger>
				</TabsList>

				<TabsContent value="table">
					<PlayersTable year={year} players={filteredPlayers} />
				</TabsContent>

				<TabsContent value="cards">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredPlayers.map((player) => (
							<PlayerCard year={year} key={player.id} player={player} />
						))}
					</div>
				</TabsContent>
			</Tabs>

			{filteredPlayers.length === 0 && (
				<div className="text-center py-12">
					<Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
					<h3 className="text-lg font-semibold mb-2">No players found</h3>
					<p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
				</div>
			)}
		</div>
	)
}
