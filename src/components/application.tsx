import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "@/components/shadcn/sonner";

import { Footer } from "@/components/layouts/footer";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import { NavigationBar } from "@/components/layouts/navigation-bar/navigation-bar";

import { type Container } from "@/types";
import { TrpcProvider } from "@/services";

export const Application: React.FC<Container> = ({ children }) => {
	return (
		<TrpcProvider>
			<ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
				<div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col px-8">
					<NavigationBar />
					<main className="my-2 flex flex-1 flex-col">{children}</main>
					<Footer />
				</div>
				<Toaster expand richColors closeButton duration={10000} position="bottom-left" offset={{ top: "4.5rem" }} />
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
		</TrpcProvider>
	);
};
