import superjson from "superjson";
import { getFetch, httpBatchLink } from "@trpc/react-query";

import { trpc } from "@/services";
import { supabaseTest } from "@/test/setup";
import { getUrl } from "@/services/trpc/client";
import { type USERNAMES, DEFAULT_PASSWORD } from "@/test/utils";
import { SUPABASE_STORAGE_KEY } from "@/services/supabase/config";

export type Requester = Awaited<ReturnType<typeof createRequester>>;

export async function createRequester(user: (typeof USERNAMES)[keyof typeof USERNAMES]) {
	const { data, error } = await supabaseTest.auth.signInWithPassword({
		password: DEFAULT_PASSWORD,
		email: `${user}@example.com`
	});

	if (error) {
		throw new Error(error.message);
	}

	return trpc.createClient({
		links: [
			httpBatchLink({
				url: getUrl(),
				transformer: superjson,
				fetch: async (input, init?) => {
					return getFetch()(input, { ...init, credentials: "include" });
				},
				headers: {
					"Content-Type": "application/json",
					Cookie: `${SUPABASE_STORAGE_KEY}=base64-${btoa(JSON.stringify(data.session))}`
				}
			})
		]
	});
}
