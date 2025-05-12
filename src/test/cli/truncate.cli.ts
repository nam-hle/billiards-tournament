#!/usr/bin/env tsx

import { truncate } from "@/test/functions/truncate";

async function main() {
	try {
		await truncate();
		console.log("Truncated tables");
	} catch (error) {
		console.error(error);
	}
}

main();
