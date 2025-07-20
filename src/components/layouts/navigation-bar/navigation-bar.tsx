import React from "react";

import { Logo } from "@/components/layouts/navigation-bar/logo";
import { Tabs } from "@/components/layouts/navigation-bar/tabs";

export const NavigationBar = async () => {
	return (
		<header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div data-testid="left-navigation-bar" className="flex w-full items-center gap-2">
				<Logo />
				<Tabs />
			</div>
		</header>
	);
};
