import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent } from "@/components/shadcn/card";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { PlayerDisplay } from "@/components/player-display";

import { toLabel, getStatusColor } from "@/utils/strings";
import { Match, ISOTime, type Group, CompletedMatch, ScheduledMatch, DefinedPlayersMatch } from "@/interfaces";

export function DaySchedule({ date, matches }: { date: string; matches: Match[]; groups: Pick<Group, "id" | "name">[] }) {
	const router = useRouter();

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
					{date === "unscheduled" ? "Unscheduled Matches" : date === "upcoming" ? "Upcoming Matches" : ISOTime.formatDate(date)}
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
								<TableHead className="w-[40px] text-center">ID</TableHead>
								{date === "upcoming" ? <TableHead className="w-[80px]">Date</TableHead> : null}
								<TableHead className="w-[6px]">Time</TableHead>
								<TableHead className="w-[80px] text-center">Type</TableHead>
								<TableHead className="w-[200px] text-right">Player 1</TableHead>
								<TableHead className="w-[80px] text-center">Score</TableHead>
								<TableHead className="w-[200px]">Player 2</TableHead>
								<TableHead className="w-[120px] text-center">Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{matches.sort(ScheduledMatch.nullableAscendingComparator).map((match) => {
								const winnerId = CompletedMatch.isInstance(match) ? CompletedMatch.getWinnerId(match) : undefined;
								const winner = winnerId !== undefined ? (match.player1?.id === winnerId ? "player1" : "player2") : null;

								return (
									<TableRow key={match.id} className="cursor-pointer hover:bg-muted" onClick={() => router.push(`/matches/${match.id}`)}>
										<TableCell className="text-center font-mono text-sm">{Match.formatId(match)}</TableCell>
										{date === "upcoming" ? (
											<TableCell className="font-mono text-sm">{ISOTime.formatDate(match.scheduledAt, { year: undefined })}</TableCell>
										) : null}
										<TableCell className="font-mono text-sm">{ISOTime.formatTime(match.scheduledAt)}</TableCell>
										<TableCell className="text-center">
											<div className="space-y-1">
												<Badge variant="outline" className="text-xs">
													{Match.getName(match)}
												</Badge>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<PlayerDisplay
												showAvatar={false}
												highlight={winner === "player1"}
												containerClassName="justify-end"
												player={DefinedPlayersMatch.isInstance(match) ? match.player1 : undefined}
											/>
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
											<PlayerDisplay
												showAvatar={false}
												highlight={winner === "player2"}
												player={DefinedPlayersMatch.isInstance(match) ? match.player2 : undefined}
											/>
										</TableCell>
										<TableCell className="text-center">
											<Badge className={getStatusColor(Match.getStatus(match))}>{toLabel(Match.getStatus(match))}</Badge>
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
