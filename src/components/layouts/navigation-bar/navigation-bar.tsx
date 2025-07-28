"use client";
import Link from "next/link";
import { match } from "path-to-regexp";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Users, Trophy } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";

import { Logo } from "@/components/layouts/navigation-bar/logo";
import { Tabs } from "@/components/layouts/navigation-bar/tabs";
import { TournamentSwitcher } from "@/components/tournament-switcher";

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
];

const isTournamentPath = match("/tournaments/:year", { end: false });

export const NavigationBar: React.FC<{ tournaments: TournamentOverview[] }> = ({ tournaments }) => {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const inSpecificTournament = isTournamentPath(pathname);

	return (
		<header className="sticky top-0 z-50 border-b bg-background">
			<div className="flex h-12 w-full items-center gap-3">
				<Logo />

				<nav className="hidden items-center space-x-4 md:flex">
					{mainPages.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="h-[30px] cursor-pointer whitespace-nowrap pt-1.5 text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5 text-[#0e0f1199] transition-colors duration-300 dark:text-[#ffffff99]">
							{item.label}
						</Link>
					))}
				</nav>

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
						<Tabs />
					</div>
				</div>
			)}
		</header>
	);
};
