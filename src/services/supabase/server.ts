import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

import { type Group } from "@/schemas";
import { Environments } from "@/environments";
import { UserControllers } from "@/controllers";
import { type Database } from "@/database.types";
import { supabaseClientOptions } from "@/services/supabase/config";

export type SupabaseInstance = SupabaseClient<Database, "public", Database["public"]>;

type UserContext = Awaited<ReturnType<typeof getCurrentUser>>;
export type MemberContext = Omit<UserContext, "group"> & { group: Group };

export async function isAuthenticated(): Promise<boolean> {
	const supabase = await createSupabaseServer();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return !!user;
}

export async function getCurrentUser(): Promise<{ id: string; email?: string; group: Group | undefined }> {
	const supabase = await createSupabaseServer();

	const {
		data: { user: currentUser }
	} = await supabase.auth.getUser();

	if (!currentUser) {
		// TODO: Redirect to something
		throw new Error("User not found");
	}

	const group = await UserControllers.getSelectedGroup(supabase, currentUser.id);

	return { ...currentUser, group: group ?? undefined };
}

export async function createSupabaseServer(): Promise<SupabaseInstance> {
	const cookieStore = await cookies();

	return createServerClient<Database>(Environments.PUBLIC.SUPABASE.URL, Environments.PUBLIC.SUPABASE.ANON_KEY, {
		...supabaseClientOptions,
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
				} catch {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
				}
			}
		}
	});
}
