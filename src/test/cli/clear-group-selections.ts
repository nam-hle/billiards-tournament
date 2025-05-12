#!/usr/bin/env tsx

import { supabaseTest } from "@/test/setup";
import { type UserName } from "@/test/utils";
import { createRequester } from "@/test/helpers/requester";

async function main() {
	try {
		const users = (await supabaseTest.auth.admin.listUsers()).data.users;

		for (const user of users) {
			if (!user.email) {
				continue;
			}

			const requester = await createRequester(user.email.split("@")[0] as UserName);
			await requester.user.selectGroup.mutate({ groupId: null });
		}
	} catch (error) {
		console.error("Error creating user:", error);
	}
}

main();
