// eslint-disable-next-line no-restricted-imports
import "./globals.css";

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Application } from "@/components/application";

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
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" sizes="any" href="/favicon.ico" />
				<title>mgm Billiards Club</title>
			</head>
			<body suppressHydrationWarning className={interSans.variable}>
				<Application>{children}</Application>
			</body>
		</html>
	);
}
