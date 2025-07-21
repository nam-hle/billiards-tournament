import { Filter } from "lucide-react";

import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/shadcn/select";

export function ScheduleFilters({
	groups,
	selectedGroup,
	onGroupChange,
	selectedStatus,
	onStatusChange
}: {
	groups: string[];
	selectedGroup: string;
	selectedStatus: string;
	onGroupChange: (value: string) => void;
	onStatusChange: (value: string) => void;
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
						<SelectItem key={group} value={group}>
							{group}
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
					<SelectItem value="scheduled">Scheduled</SelectItem>
					<SelectItem value="in-progress">In Progress</SelectItem>
					<SelectItem value="completed">Completed</SelectItem>
					<SelectItem value="postponed">Postponed</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
