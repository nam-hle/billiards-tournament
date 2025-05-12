import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";

import { getCurrentUser, createSupabaseServer } from "@/services/supabase/server";

export const createContext = async () => {
	return { supabase: await createSupabaseServer() };
};

const t = initTRPC.context<typeof createContext>().create({ transformer: superjson });

export const router = t.router;

const withAuthenticate = t.middleware(async ({ ctx, next }) => {
	try {
		const user = await getCurrentUser();

		return next({ ctx: { ...ctx, user } });
	} catch (error) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
});

export const withSelectedGroup = withAuthenticate.unstable_pipe(async ({ ctx, next }) => {
	const { group, ...rest } = ctx.user;

	if (!group) {
		throw new TRPCError({ code: "PRECONDITION_FAILED" });
	}

	return next({ ctx: { ...ctx, user: { ...rest, group } } });
});

const withErrorHandler = t.middleware(async ({ ctx, next }) => {
	try {
		return await next({ ctx });
	} catch (error) {
		if (error instanceof TRPCError) {
			throw error;
		}

		// eslint-disable-next-line no-console
		console.error("Unexpected error:", error);

		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred"
		});
	}
});

export const publicProcedure = t.procedure.use(withErrorHandler);
export const privateProcedure = publicProcedure.use(withAuthenticate);
