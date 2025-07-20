"use client";

import React from "react";
import Link from "next/link";
import { Split } from "lucide-react";

import { useHomePage } from "@/hooks";

export const Logo = () => {
	const homePage = useHomePage();

	return (
		<Link href="/">
			<div data-testid="logo" className="flex items-center">
				<Split className="h-6 w-6" />
				{homePage && <span className="ml-2 text-xl font-bold">BillPilot</span>}
			</div>
		</Link>
	);
};
