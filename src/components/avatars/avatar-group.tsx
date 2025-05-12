import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";

import { FallbackAvatar } from "@/components/avatars/fallbackable-avatar";

import type { UserMeta } from "@/schemas";

export const AvatarGroup = ({ users, max = 3 }: { max?: number; users: UserMeta[] }) => {
	const totalUsers = users.length;
	const displayUsers = totalUsers === max + 1 ? users : users.slice(0, max);
	const remaining = totalUsers - displayUsers.length;

	return (
		<div className="flex -space-x-2 overflow-hidden">
			{displayUsers.map((user) => (
				<FallbackAvatar {...user} key={user.userId} className="inline-block border-2 border-background" />
			))}
			{remaining > 0 && (
				<Avatar className="inline-block border-2 border-background bg-muted">
					<AvatarFallback>+{remaining}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
