"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/shadcn/button";

export const AuthenticationActions = () => {
	const pathName = usePathname();

	if (pathName === "/signup" || pathName === "/login") {
		return null;
	}

	return (
		<>
			<Link
				href="/signup"
				data-testid="navigation-item-sign-up"
				className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
				Sign Up
			</Link>
			<Button asChild size="sm" data-testid="navigation-item-login">
				<Link href="/login">Login</Link>
			</Button>
		</>
	);
};
