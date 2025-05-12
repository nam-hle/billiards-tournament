"use client";

import React from "react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";

import { AvatarContainer } from "@/components/avatars/avatar-container";
import { GroupSwitcher } from "@/components/layouts/navigation-bar/group-switcher";
import { NotificationContainer } from "@/components/layouts/notifications/notification-container";

import { useHomePage } from "@/hooks";

export const UserActions = () => {
	const homePage = useHomePage();

	if (homePage) {
		return (
			<>
				<Button asChild size="sm" data-testid="navigation-item-dashboard">
					<Link href="/dashboard">Dashboard</Link>
				</Button>
				<AvatarContainer />
			</>
		);
	}

	return (
		<>
			<GroupSwitcher />
			<NotificationContainer />
			<AvatarContainer />
		</>
	);
};
