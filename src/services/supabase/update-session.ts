import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { Environments } from "@/environments";
import { supabaseClientOptions } from "@/services/supabase/config";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(Environments.PUBLIC.SUPABASE.URL, Environments.PUBLIC.SUPABASE.ANON_KEY, {
		...supabaseClientOptions,
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
				supabaseResponse = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
			}
		}
	});

	if (request.nextUrl.pathname === "/") {
		return supabaseResponse;
	}

	const users = await supabase.auth.getUser();

	if (users.error) {
		return NextResponse.redirect(new URL("/login", request.url), {
			status: 302
		});
	}

	return supabaseResponse;
}
