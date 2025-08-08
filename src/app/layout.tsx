// eslint-disable-next-line no-restricted-imports
import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { Application } from "@/components/application";

import { TournamentRepository } from "@/repositories/tournament.repository";

export const revalidate = 300;

const interSans = Inter({
	subsets: ["latin"],
	variable: "--font-geist-sans"
});

export const metadata: Metadata = {
	description: "Nam Hoang Le",
	title: {
		default: "mgm Billiards Club",
		template: "%s | mgm Billiards Club"
	}
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const tournamentRepo = new TournamentRepository();
	const tournaments = await tournamentRepo.getAll();
	const tournamentSummaries = await Promise.all(tournaments.map((tournament) => tournamentRepo.getSummary({ tournamentId: tournament.id })));

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" sizes="any" href="/favicon.ico" />
				<title>mgm Billiards Club</title>
			</head>
			<body suppressHydrationWarning className={interSans.variable}>
				<Application tournaments={tournamentSummaries}>{children}</Application>
				<Analytics />
			</body>
		</html>
	);
}
