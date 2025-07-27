import React from "react";
import { format, formatDistanceToNow } from "date-fns";

import { ThemeToggleButton } from "@/components/buttons/theme-toggle-button";

const buildTime = new Date(process.env.BUILD_TIME!);

export const Footer = () => {
	return (
		<footer className="mt-auto w-full border-t bg-background">
			<div className="w-full border-t py-4">
				<div className="flex w-full flex-row items-center justify-between gap-4">
					<div className="flex flex-row items-center gap-2">
						<ThemeToggleButton />
						<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">Built with ♥ by mgm Billiards Club</p>
					</div>
					<div className="flex flex-row items-center gap-2">
						<p title={format(buildTime, "yyyy-MM-dd HH:mm:ss")} className="text-center text-sm leading-loose text-muted-foreground md:text-left">
							Last updated {formatDistanceToNow(buildTime, { addSuffix: true })}
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
