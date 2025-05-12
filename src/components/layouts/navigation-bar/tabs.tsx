"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";

import { useHomePage } from "@/hooks";

interface Tab {
	href: string;
	label: string;
	match: (path: string) => boolean;
}

const tabs: Tab[] = [
	{
		label: "Dashboard",
		href: "/dashboard",
		match: (path) => path === "dashboard"
	},
	{
		label: "Bills",
		href: "/bills",
		match: (path) => path === "bills"
	},
	{
		label: "Transactions",
		href: "/transactions",
		match: (path) => path === "transactions"
	}
];

export const Tabs = () => {
	const pathname = usePathname();
	const pageName = React.useMemo(() => pathname.split("/")[1], [pathname]);
	const isHomePage = useHomePage();

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [activeIndex, setActiveIndex] = useState(() => tabs.findIndex((tab) => tab.match(pageName)));
	const [hoverStyle, setHoverStyle] = useState({});
	const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
	const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

	useEffect(() => {
		if (!tabs.some((tab) => tab.match(pageName))) {
			setActiveIndex(() => -1);
			setActiveStyle(() => ({ left: "0px", width: "0px" }));
		}
	}, [pageName]);

	useEffect(() => {
		if (hoveredIndex !== null) {
			const hoveredElement = tabRefs.current[hoveredIndex];

			if (hoveredElement) {
				const { offsetLeft, offsetWidth } = hoveredElement;
				setHoverStyle({
					left: `${offsetLeft}px`,
					width: `${offsetWidth}px`
				});
			}
		}
	}, [hoveredIndex]);

	useEffect(() => {
		const activeElement = tabRefs.current[activeIndex];

		if (activeElement) {
			const { offsetLeft, offsetWidth } = activeElement;
			setActiveStyle({
				left: `${offsetLeft}px`,
				width: `${offsetWidth}px`
			});
		}
	}, [activeIndex]);

	useEffect(() => {
		requestAnimationFrame(() => {
			const overviewElement = tabRefs.current[activeIndex];

			if (overviewElement) {
				const { offsetLeft, offsetWidth } = overviewElement;
				setActiveStyle({
					left: `${offsetLeft}px`,
					width: `${offsetWidth}px`
				});
			}
		});
	}, [activeIndex]);

	const { theme } = useTheme();
	const isDarkMode = theme === "dark";

	if (isHomePage) {
		return null;
	}

	return (
		<Card className={`relative flex max-w-[1200px] items-center justify-center border-none shadow-none ${isDarkMode ? "bg-transparent" : ""}`}>
			<CardContent className="relative flex items-center p-0">
				{/* Hover Highlight */}
				<div
					style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
					className="absolute flex h-[30px] items-center rounded-[6px] bg-[#0e0f1114] transition-all duration-200 ease-out dark:bg-[#ffffff1a]"
				/>

				{/* Active Indicator */}
				<div style={activeStyle} className="absolute bottom-[-2px] h-[2px] bg-[#0e0f11] transition-all duration-200 ease-out dark:bg-white" />

				{/* Tabs */}
				<div className="relative flex items-center space-x-[6px]">
					{tabs.map((tab, index) => (
						<Link
							key={index}
							href={tab.href}
							onMouseLeave={() => setHoveredIndex(null)}
							onMouseEnter={() => setHoveredIndex(index)}
							onClick={() => {
								setActiveIndex(index);
							}}
							data-testid={"navigation-item-" + tab.label.toLowerCase()}
							ref={(el) => {
								tabRefs.current[index] = el;
							}}
							className={`h-[30px] cursor-pointer px-3 py-2 pb-[0.52rem] transition-colors duration-300 ${
								index === activeIndex ? "text-[#0e0e10] dark:text-white" : "text-[#0e0f1199] dark:text-[#ffffff99]"
							}`}>
							<div className="flex h-full items-center justify-center whitespace-nowrap text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5">
								{tab.label}
							</div>
						</Link>
					))}
					<Button asChild size="sm" variant="default" data-testid="navigation-item-create">
						<Link href="/bills/new">Create</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
