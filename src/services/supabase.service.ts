import { createClient } from "@supabase/supabase-js";

import { Environments } from "@/environments";
import { type Database } from "@/database.types";

export const supabaseClient = createClient<Database>(Environments.SUPABASE.URL, Environments.SUPABASE.ANON_KEY);
