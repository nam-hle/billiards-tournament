import type { SupabaseClientOptions } from "@supabase/supabase-js/dist/module/lib/types";

export const SUPABASE_STORAGE_KEY = "sp-auth-key";

export const supabaseClientOptions: SupabaseClientOptions<"public"> = {
	auth: { storageKey: SUPABASE_STORAGE_KEY }
};
