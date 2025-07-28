"use client";
import Link from "next/link";
import { type Route } from "next";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { match, compile } from "path-to-regexp";
import { Menu, Users, Trophy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";

import { Logo } from "@/components/layouts/navigation-bar/logo";
import { TournamentSwitcher } from "@/components/tournament-switcher";
import { Tabs, type Tab } from "@/components/layouts/navigation-bar/tabs";

import type { TournamentOverview } from "@/interfaces";

const mainPages = [
	{
		icon: Trophy,
		label: "Tournaments",
		href: "/tournaments"
	},
	{
		icon: Users,
		label: "Players",
		href: "/players"
	}
] as const;

export const NavigationBar: React.FC<{ tournaments: TournamentOverview[] }> = ({ tournaments }) => {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const inSpecificTournament = match("/tournaments/:year", { end: false })(pathname);

	return (
		<header className="sticky top-0 z-50 border-b bg-background">
			<div className="flex h-12 w-full items-center gap-3">
				<Logo />

				<MainTabs />

				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button size="icon" variant="ghost" className="ml-auto md:hidden">
							<Menu className="h-4 w-4" />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[300px] sm:w-[400px]">
						<div className="flex flex-col space-y-4">
							<div className="flex items-center space-x-2 border-b pb-4">
								<Trophy className="h-6 w-6 text-primary" />
								<span className="text-lg font-semibold">TournamentPro</span>
							</div>
							<nav className="flex flex-col space-y-2">
								{mainPages.map((item) => {
									const Icon = item.icon;

									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setIsOpen(false)}
											className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
											<Icon className="h-4 w-4" />
											<span>{item.label}</span>
										</Link>
									);
								})}
							</nav>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{inSpecificTournament && (
				<div className="flex h-12 w-full items-center gap-3 pb-3">
					<div className="border-1 flex flex-row items-center overflow-x-auto overflow-y-hidden">
						<TournamentSwitcher tournaments={tournaments} />
						<TournamentTabs />
					</div>
				</div>
			)}
		</header>
	);
};

function useTournamentTabs(): Tab[] {
	const pathname = usePathname();

	const matchResult = match("/tournaments/:year", { end: false })(pathname);

	if (!matchResult) {
		return [];
	}

	const year = matchResult.params.year as string;

	return [
		{ label: "Overview", ...createHrefAndMatcher("/tournaments/:year") },
		{ label: "Players", ...createHrefAndMatcher("/tournaments/:year/players") },
		{ label: "Schedule", ...createHrefAndMatcher("/tournaments/:year/schedule") },
		{ label: "Groups", ...createHrefAndMatcher("/tournaments/:year/groups") },
		{ label: "Knockout", ...createHrefAndMatcher("/tournaments/:year/knockout") }
	] as const;

	function createHrefAndMatcher(pattern: string) {
		return { match: (path: string) => !!match(pattern)(path), href: compile(pattern)({ year }) as Route<string> };
	}
}

const MainTabs = () => {
	const tabs = useMainTabs();

	return <Tabs tabs={tabs} />;
};

function useMainTabs(): Tab[] {
	return [
		{ label: "Tournaments", ...createHrefAndMatcher("/tournaments") },
		{ label: "Players", ...createHrefAndMatcher("/players") }
	] as const;

	function createHrefAndMatcher(href: string) {
		return { href: href as Route, match: (path: string) => !!match(href)(path) };
	}
}

const TournamentTabs = () => {
	const tabs = useTournamentTabs();

	return <Tabs tabs={tabs} />;
};
