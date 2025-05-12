import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/routers/app.router";
import { createContext } from "@/services/trpc/server";

const handler = (req: Request) => {
	return fetchRequestHandler({ req, createContext, router: appRouter, endpoint: "/api/trpc" });
};

export { handler as GET, handler as POST };
