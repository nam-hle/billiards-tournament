"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider = ({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) => (
	<NextThemesProvider disableTransitionOnChange {...props}>
		{children}
	</NextThemesProvider>
);
