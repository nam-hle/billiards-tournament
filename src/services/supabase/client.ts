import { createBrowserClient } from "@supabase/ssr";

import { Environments } from "@/environments";
import { supabaseClientOptions } from "@/services/supabase/config";

export function createSupabaseClient() {
	return createBrowserClient(Environments.PUBLIC.SUPABASE.URL, Environments.PUBLIC.SUPABASE.ANON_KEY, supabaseClientOptions);
}
