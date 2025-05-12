import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { type UserMeta } from "@/schemas";
import { type TestId, type ClassName } from "@/types";
import { getAvatarFallback } from "@/utils/avatar-fallback";

export namespace FallbackAvatar {
	export interface Props extends ClassName, TestId, UserMeta {}
}

export const FallbackAvatar: React.FC<FallbackAvatar.Props> = (props) => {
	const { fullName, className, avatarFile } = props;
	const { data } = trpc.storage.get.useQuery({ bucketName: "avatars", fileName: avatarFile || "" }, { enabled: !!avatarFile });

	return (
		<Avatar className={cn("h-10 w-10", className)} data-testid={props["data-testid"] ?? "avatar"}>
			<AvatarImage src={data} alt={fullName} title={fullName} />
			<AvatarFallback title={fullName} data-testid="avatar-fallback">
				{getAvatarFallback(fullName)}
			</AvatarFallback>
		</Avatar>
	);
};
