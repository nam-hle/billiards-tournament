"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useHomePage } from "@/hooks";

export const Logo = () => {
	const homePage = useHomePage();

	return (
		<Link href="/">
			<div data-testid="logo" className="flex items-center">
				<Image width={24} height={24} src="/logo.svg" alt="Application Logo" />
				{homePage && <span className="ml-2 text-xl font-bold">BillPilot</span>}
			</div>
		</Link>
	);
};
