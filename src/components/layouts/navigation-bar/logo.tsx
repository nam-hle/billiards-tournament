"use client";

import React from "react";
import Link from "next/link";
import { Split } from "lucide-react";

import { useHomePage, useAuthenticatingPage } from "@/hooks";

export const Logo = () => {
	const homePage = useHomePage();
	const authenticatingPage = useAuthenticatingPage();

	return (
		<Link href="/">
			<div data-testid="logo" className="flex items-center">
				<Split className="h-6 w-6" />
				{(homePage || authenticatingPage) && <span className="ml-2 text-xl font-bold">BillPilot</span>}
			</div>
		</Link>
	);
};
