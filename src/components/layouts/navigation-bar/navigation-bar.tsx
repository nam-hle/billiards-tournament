import React from "react";
import Link from "next/link";

import { Logo } from "@/components/layouts/navigation-bar/logo";
import { Tabs } from "@/components/layouts/navigation-bar/tabs";
import { TournamentSwitcher } from "@/components/tournament-switcher";

import type { TournamentOverview } from "@/interfaces";

const mainPages = [
	{
		label: "Tournaments",
		href: "/tournaments"
	},
	{
		label: "Players",
		href: "/players"
	}
];

export const NavigationBar: React.FC<{ tournaments: TournamentOverview[] }> = ({ tournaments }) => {
	return (
		<header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div data-testid="left-navigation-bar" className="flex w-full items-center gap-2">
				<Logo />
				<div className="relative flex items-center space-x-[6px]">
					{mainPages.map((page) => {
						return (
							<Link
								key={page.href}
								href={page.href}
								className="h-[30px] cursor-pointer px-3 py-2 pb-[0.52rem] text-[#0e0f1199] transition-colors duration-300 dark:text-[#ffffff99]">
								<div className="flex h-full items-center justify-center whitespace-nowrap text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5">
									{page.label}
								</div>
							</Link>
						);
					})}
				</div>

				<TournamentSwitcher tournaments={tournaments} />
				<Tabs />
			</div>
		</header>
	);
};
