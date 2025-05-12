import * as Path from "node:path";

import base from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

import { type Database } from "@/database.types";
import { truncate } from "@/test/functions/truncate";
import { supabaseClientOptions } from "@/services/supabase/config";

loadEnvConfig(Path.join(__dirname, "..", ".."));

export const supabaseTest = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	supabaseClientOptions
);

export const test = base.extend<{ forEachTest: void }>({
	forEachTest: [
		async ({ page, baseURL }, use) => {
			if (!baseURL) {
				throw new Error("⚠️ baseURL must be defined in Playwright config.");
			}

			await page.route("**", (route) => {
				const url = route.request().url();

				if (!url.startsWith(baseURL)) {
					console.error(`🚨 Disallowed request detected: ${url}`);
					throw new Error(`❌ Only requests to ${baseURL} are allowed, but found: ${url}`);
				}

				route.continue();
			});

			await truncate();
			await use();
		},
		{ auto: true }
	]
});
