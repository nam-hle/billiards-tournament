import React from "react";
import Link from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { cn } from "@/utils/cn";
import { getAbbrName } from "@/utils/strings";

export namespace PlayerDisplay {
	export interface Props {
		readonly player?: { id: string; name: string };

		readonly highlight?: boolean;
		readonly fallbackName?: string;

		readonly showLink?: boolean;
		readonly showAvatar?: boolean;

		readonly nameClassName?: string;
		readonly avatarClassName?: string;
		readonly fallbackClassName?: string;
		readonly containerClassName?: string;
	}
}

export const PlayerDisplay: React.FC<PlayerDisplay.Props> = (props) => {
	const {
		player,
		nameClassName,
		showLink = true,
		avatarClassName,
		highlight = false,
		showAvatar = true,
		fallbackClassName,
		fallbackName = "?",
		containerClassName
	} = props;

	const content = (
		<div className={cn("flex items-center gap-3", containerClassName)}>
			{showAvatar && (
				<Avatar className={cn("h-8 w-8", avatarClassName)}>
					<AvatarImage alt={player?.name ?? ""} />
					<AvatarFallback className={cn("text-xs", fallbackClassName)}>{player?.name ? getAbbrName(player.name) : "?"}</AvatarFallback>
				</Avatar>
			)}
			<p className={cn("font-medium", highlight ? "text-green-600" : "", nameClassName)}>{player?.name ?? fallbackName}</p>
		</div>
	);

	if (!player || !showLink) {
		return content;
	}

	return <Link href={`/players/${player.id}`}>{content}</Link>;
};
