import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { seedUsers } from "@/test/functions/seed-users";
import { createRequester } from "@/test/helpers/requester";

test("Create group", async () => {
	await seedUsers();
	const requester = await createRequester("harry");

	const firstGroup = await requester.groups.create.mutate({ name: "First group" });
	await requester.groups.create.mutate({ name: "Second group" });

	expect(await requester.user.groups.query()).toEqual([
		{ name: "First group", id: expect.any(String), displayId: expect.stringMatching(/^\d{8}$/) },
		{ name: "Second group", id: expect.any(String), displayId: expect.stringMatching(/^\d{8}$/) }
	]);

	expect(await requester.groups.membersByGroupId.query({ groupId: firstGroup.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});
