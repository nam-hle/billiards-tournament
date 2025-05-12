import React from "react";

import { FallbackAvatar } from "@/components/avatars/fallbackable-avatar";

import { type UserMeta } from "@/schemas";

export namespace UserDisplay {
	export interface Props extends UserMeta {}
}

export const UserDisplay: React.FC<UserDisplay.Props> = (props) => {
	return (
		<div data-testid="user-display" className="flex flex-row items-center gap-2">
			<FallbackAvatar {...props} />
			<p className="text-sm font-medium">{props.fullName}</p>
		</div>
	);
};
