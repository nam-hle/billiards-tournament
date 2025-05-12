import React from "react";

import { cn } from "@/utils/cn";

export const CounterBadge: React.FC<{ count: number | undefined }> = ({ count }) => {
	if (count === 0 || count === undefined) {
		return null;
	}

	return (
		<span
			className={cn(
				"absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white",
				"-translate-y-[20%] translate-x-[20%] transform"
			)}>
			{count}
		</span>
	);
};
