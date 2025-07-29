"use client";
import React from "react";
import { usePathname } from "next/navigation";

import { Toaster } from "@/components/shadcn/sonner";

import { Footer } from "@/components/layouts/footer";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import { NavigationBar } from "@/components/layouts/navigation-bar/navigation-bar";

import { type Container } from "@/types";
import { type TournamentOverview } from "@/interfaces";

export const Application: React.FC<Container & { tournaments: TournamentOverview[] }> = ({ children, tournaments }) => {
	const pathname = usePathname();

	if (pathname === "/" || pathname === "/auth") {
		return (
			<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
				{children}
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
			<div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-8">
				<NavigationBar tournaments={tournaments} />
				<main className="flex flex-1 flex-col">{children}</main>
				<Footer />
			</div>
			<Toaster expand richColors closeButton duration={10000} position="bottom-left" offset={{ top: "4.5rem" }} />
		</ThemeProvider>
	);
};
