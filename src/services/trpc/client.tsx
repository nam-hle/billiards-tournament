"use client";
import superjson from "superjson";
import React, { useState } from "react";
import { splitLink, httpSubscriptionLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFetch, loggerLink, httpBatchLink, createTRPCReact } from "@trpc/react-query";

import { type Container } from "@/types";
import { Environments } from "@/environments";
import type { AppRouter } from "@/routers/app.router";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 5 * 1000 } }
});

export const getUrl = () => {
	const base = (() => {
		if (typeof window !== "undefined") {
			return window.location.origin;
		}

		return Environments.PUBLIC.APP.URL ?? `http://localhost:${Environments.PUBLIC.APP.PORT}`;
	})();

	return `${base}/api/trpc`;
};

export const TrpcProvider: React.FC<Container> = ({ children }) => {
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				loggerLink(),
				splitLink({
					condition: (op) => op.type === "subscription",
					true: httpSubscriptionLink({
						url: getUrl(),
						/**
						 * @see https://trpc.io/docs/v11/data-transformers
						 */
						transformer: superjson
					}),
					false: httpBatchLink({
						url: getUrl(),
						transformer: superjson,
						fetch: async (input, init?) => {
							const fetch = getFetch();

							return fetch(input, {
								...init,
								credentials: "include"
							});
						}
					})
				})
			]
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
