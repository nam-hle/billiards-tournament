import { Calendar } from "lucide-react";
import { parse, format } from "date-fns";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { Match, type Group, CompletedMatch, type MatchStatus, DefinedPlayersMatch } from "@/interfaces";

export function DaySchedule({ date, matches }: { date: string; matches: Match[]; groups: Pick<Group, "id" | "name">[] }) {
	if (matches.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				<Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
				<p>No matches scheduled for this day</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="mb-6 flex items-center gap-2">
				<Calendar className="h-5 w-5 text-primary" />
				<h3 className="text-lg font-semibold">
					{date === "unscheduled" ? "Unscheduled Matches" : date === "upcoming" ? "Upcoming Matches" : formatDate(date)}
				</h3>
				<Badge className="ml-2" variant="secondary">
					{matches.length} {matches.length === 1 ? "match" : "matches"}
				</Badge>
			</div>

			<Card>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow>
								{date === "upcoming" ? <TableHead className="w-[140px]">Date</TableHead> : null}
								<TableHead className="w-[100px]">Time</TableHead>
								<TableHead className="w-[140px] text-center">Type</TableHead>
								<TableHead>Player 1</TableHead>
								<TableHead className="w-[100px] text-center">Score</TableHead>
								<TableHead>Player 2</TableHead>
								<TableHead className="w-[120px] text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{matches
								// .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
								.map((match) => {
									const winnerId =
										DefinedPlayersMatch.isInstance(match) && CompletedMatch.isInstance(match) ? CompletedMatch.getWinnerId(match) : undefined;
									const winner = winnerId !== undefined ? (match.player1Id === winnerId ? "player1" : "player2") : null;

									return (
										<TableRow key={match.id}>
											{date === "upcoming" ? (
												<TableCell className="font-mono text-sm">
													{match.scheduledAt
														? formatDate(match.scheduledAt.date, { month: "short", day: "numeric", weekday: "short" })
														: "Unscheduled"}
												</TableCell>
											) : null}
											<TableCell className="font-mono text-sm">{match.scheduledAt ? formatTime(match.scheduledAt.time) : "-"}</TableCell>
											<TableCell className="text-center">
												<div className="space-y-1">
													<Badge variant="outline" className="text-xs">
														{match.name}
													</Badge>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className={`font-medium ${winner === "player1" ? "text-green-600" : ""}`}>
														{DefinedPlayersMatch.isInstance(match) ? match.player1Name : "TBD"}
													</span>
													{winner === "player1" && (
														<Badge variant="default" className="px-1 py-0 text-xs">
															W
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="text-center">
												{match.score1 != null && match.score2 != null ? (
													<Badge variant="outline" className="font-mono">
														{match.score1} : {match.score2}
													</Badge>
												) : (
													<span className="text-muted-foreground">-</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className={`font-medium ${winner === "player2" ? "text-green-600" : ""}`}>
														{DefinedPlayersMatch.isInstance(match) ? match.player2Name : "TBD"}
													</span>
													{winner === "player2" && (
														<Badge variant="default" className="px-1 py-0 text-xs">
															W
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className="text-center">
												<Badge className={getStatusColor(Match.getStatus(match))}>{getStatusText(Match.getStatus(match))}</Badge>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
	return new Date(dateString).toLocaleDateString("en-US", options ?? { month: "long", day: "numeric", weekday: "long", year: "numeric" });
};

export const getStatusColor = (status: MatchStatus) => {
	switch (status) {
		case "completed":
			return "bg-green-100 text-green-800";
		case "in-progress":
			return "bg-blue-100 text-blue-800";
		case "scheduled":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export const formatTime = (timeString: string) => {
	const parsed = parse(timeString, "HH:mm", new Date());

	return format(parsed, "hh:mm a");
};

export const getStatusText = (status: MatchStatus) => {
	switch (status) {
		case "completed":
			return "Completed";
		case "in-progress":
			return "Live";
		case "scheduled":
			return "Scheduled";
		case "scheduling":
			return "Scheduling";
		case "waiting":
			return "Waiting";
		default:
			return "Unknown";
	}
};
