"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

import { Card, CardContent } from "@/components/shadcn/card";

import { useHomePage } from "@/hooks";

interface Tab {
	href: string;
	label: string;
	match: (path: string) => boolean;
}

function useTabs(): Tab[] {
	const pathname = usePathname();

	if (/^\/tournaments\/\d+($|\/)/.test(pathname)) {
		const basePath = pathname.split("/").slice(0, 3).join("/");

		return [
			// TODO: Reduce duplications
			{ href: basePath, label: "Overview", match: (path) => path === basePath },
			{ label: "Players", href: `${basePath}/players`, match: (path) => path.startsWith(`${basePath}/players`) },
			{ label: "Schedule", href: `${basePath}/schedule`, match: (path) => path.startsWith(`${basePath}/schedule`) },
			{ label: "Groups", href: `${basePath}/groups`, match: (path) => path.startsWith(`${basePath}/groups`) },
			{ label: "Knockout", href: `${basePath}/knockout`, match: (path) => path.startsWith(`${basePath}/knockout`) }
			// { label: "Results", href: `${basePath}/results`, match: (path) => path.startsWith(`${basePath}/results`) }
		];
	}

	return [];
}

export const Tabs = () => {
	const tabs = useTabs();
	const isHomePage = useHomePage();
	const pathname = usePathname();

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [activeIndex, setActiveIndex] = useState(() => tabs.findIndex((tab) => tab.match(pathname)));
	const [hoverStyle, setHoverStyle] = useState({});
	const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
	const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

	useEffect(() => {
		if (!tabs.length) {
			if (activeIndex !== -1) {
				setActiveIndex(() => -1);
				setActiveStyle(() => ({ left: "0px", width: "0px" }));
			}

			return;
		}

		const currentActiveIndex = tabs.findIndex((tab) => tab.match(pathname));

		if (currentActiveIndex < 0) {
			setActiveIndex(() => -1);
			setActiveStyle(() => ({ left: "0px", width: "0px" }));
		} else if (currentActiveIndex !== activeIndex) {
			setActiveIndex(currentActiveIndex);
		}
	}, [activeIndex, pathname, tabs]);

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
				{/*/!* Hover Highlight *!/*/}
				<div
					style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
					className="absolute flex h-[30px] items-center rounded-[6px] bg-[#0e0f1114] transition-all duration-200 ease-out dark:bg-[#ffffff1a]"
				/>

				{/*Active Indicator */}
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
								index === -1 ? "text-[#0e0e10] dark:text-white" : "text-[#0e0f1199] dark:text-[#ffffff99]"
							}`}>
							<div className="flex h-full items-center justify-center whitespace-nowrap text-sm font-[var(--www-mattmannucci-me-geist-regular-font-family)] leading-5">
								{tab.label}
							</div>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
