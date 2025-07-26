"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
	return (
		<Link href="/">
			<div data-testid="logo" className="flex items-center">
				<Image width={24} height={24} src="/logo.svg" alt="Application Logo" />
				<span className="ml-2 text-xl font-semibold">mgm Billiards Club</span>
			</div>
		</Link>
	);
};
