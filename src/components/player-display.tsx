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

const gradientClasses = [
	"bg-gradient-to-r from-pink-500 to-yellow-500",
	"bg-gradient-to-r from-green-400 to-blue-500",
	"bg-gradient-to-r from-indigo-500 to-purple-600",
	"bg-gradient-to-r from-red-400 to-orange-500",
	"bg-gradient-to-r from-teal-400 to-lime-500",
	"bg-gradient-to-r from-fuchsia-500 to-pink-500",
	"bg-gradient-to-r from-yellow-400 to-red-500",
	"bg-gradient-to-r from-sky-400 to-blue-600",
	"bg-gradient-to-r from-violet-500 to-indigo-600",
	"bg-gradient-to-r from-amber-500 to-rose-500",
	"bg-gradient-to-r from-cyan-400 to-emerald-500",
	"bg-gradient-to-r from-lime-400 to-green-500"
];

export function getRandomGradient(seed: string) {
	const hash = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);

	return `text-white ${gradientClasses[hash % gradientClasses.length]}`;
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
					<AvatarFallback className={cn("text-xs", fallbackClassName, player?.id ? getRandomGradient(player.name) : "")}>
						{player?.name ? getAbbrName(player.name) : "?"}
					</AvatarFallback>
				</Avatar>
			)}
			<p className={cn("font-medium", highlight ? "text-green-600" : "", !player ? "font-normal" : "", nameClassName)}>
				{player?.name ?? fallbackName}
			</p>
		</div>
	);

	if (!player || !showLink) {
		return content;
	}

	return <Link href={`/players/${player.id}`}>{content}</Link>;
};
