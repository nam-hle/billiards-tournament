import { Filter } from "lucide-react";

import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

import { type Group, type Player } from "@/interfaces";

export function ScheduleFilters({
	groups,
	players,
	selectedGroup,
	onGroupChange,
	selectedStatus,
	onStatusChange,
	onPlayerChange,
	selectedPlayer
}: {
	players: Player[];
	selectedGroup: string;
	selectedStatus: string;
	selectedPlayer: string;
	groups: Pick<Group, "id" | "name">[];
	onGroupChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onPlayerChange: (value: string) => void;
}) {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Filter className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm font-medium">Filters:</span>
			</div>

			<Select value={selectedGroup} onValueChange={onGroupChange}>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="All Groups" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Groups</SelectItem>
					{groups.map((group) => (
						<SelectItem key={group.id} value={group.id}>
							{group.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={selectedStatus} onValueChange={onStatusChange}>
				<SelectTrigger className="w-[140px]">
					<SelectValue placeholder="All Status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Status</SelectItem>
					<SelectItem value="scheduling">Scheduling</SelectItem>
					<SelectItem value="scheduled">Scheduled</SelectItem>
					<SelectItem value="upcoming">Upcoming</SelectItem>
					<SelectItem value="ongoing">Ongoing</SelectItem>
					<SelectItem value="completed">Completed</SelectItem>
					<SelectItem value="waiting">Waiting</SelectItem>
				</SelectContent>
			</Select>

			<Select value={selectedPlayer} onValueChange={onPlayerChange}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="All Players" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Players</SelectItem>
					{players.map((player) => {
						return (
							<SelectItem key={player.id} value={player.id}>
								{player.name}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
