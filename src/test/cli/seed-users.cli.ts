#!/usr/bin/env tsx

import { seedUsers } from "@/test/functions/seed-users";

async function main() {
	try {
		await seedUsers();
	} catch (error) {
		console.error("Error creating user:", error);
	}
}

main();
