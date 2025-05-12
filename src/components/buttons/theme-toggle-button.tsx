"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";

import { ClientOnly } from "@/components/mics/client-only";

export type ThemeToggleButton = "light" | "dark";

interface UseColorModeReturn {
	toggleColorMode: () => void;
	colorMode: ThemeToggleButton;
	setColorMode: (colorMode: ThemeToggleButton) => void;
}

function useColorMode(): UseColorModeReturn {
	const { setTheme, resolvedTheme } = useTheme();
	const toggleColorMode = () => {
		setTheme(resolvedTheme === "light" ? "dark" : "light");
	};

	return {
		toggleColorMode,
		setColorMode: setTheme,
		colorMode: resolvedTheme as ThemeToggleButton
	};
}

export const ThemeToggleButton = React.forwardRef<HTMLButtonElement>(function ColorModeButton() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<ClientOnly fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
			<Button size="icon" variant="outline" onClick={toggleColorMode} aria-label="Toggle color mode" className="relative h-8 w-8 rounded-full">
				{colorMode === "dark" ? <Moon /> : <Sun />}
			</Button>
		</ClientOnly>
	);
});
