import React from "react";

import { ThemeToggleButton } from "@/components/buttons/theme-toggle-button";

export const Footer = () => {
	return (
		<footer className="mt-auto w-full border-t bg-background">
			<div className="w-full border-t py-4">
				<div className="flex w-full flex-row items-center justify-between gap-4">
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						© {new Date().getFullYear()} BillPilot. All rights reserved.
					</p>
					<div className="flex flex-row items-center gap-2">
						<ThemeToggleButton />
						<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">Built with ♥ by BillPilot Team</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
