"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Logo = () => {
	const pathname = usePathname();

	return (
		<Link href="/">
			<div data-testid="logo" className="flex items-center">
				<Image width={24} height={24} src="/logo.svg" alt="Application Logo" />
				{pathname === "/tournaments" && <span className="ml-2 text-xl font-bold">mgm Billiards Club</span>}
			</div>
		</Link>
	);
};
