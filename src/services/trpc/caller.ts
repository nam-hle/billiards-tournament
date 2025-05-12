import { appRouter } from "@/routers/app.router";
import { createContext } from "@/services/trpc/server";

export async function createCaller() {
	return appRouter.createCaller(await createContext());
}
