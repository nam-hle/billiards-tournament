import React from "react";

import { Logo } from "@/components/layouts/navigation-bar/logo";
import { Tabs } from "@/components/layouts/navigation-bar/tabs";
import { UserActions } from "@/components/layouts/navigation-bar/user-actions";
import { AuthenticationActions } from "@/components/layouts/navigation-bar/authentication-actions";

import { isAuthenticated } from "@/services/supabase/server";

export const NavigationBar = async () => {
	const authenticated = await isAuthenticated();

	return (
		<header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div data-testid="left-navigation-bar" className="flex w-full items-center gap-2">
				<Logo />
				{authenticated && <Tabs />}
			</div>
			<div data-testid="right-navigation-bar" className="flex w-full items-center justify-end gap-2">
				{authenticated ? <UserActions /> : <AuthenticationActions />}
			</div>
		</header>
	);
};
