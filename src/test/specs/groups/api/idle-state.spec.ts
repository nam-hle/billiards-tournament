import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { type Group } from "@/schemas";
import { FULL_NAMES } from "@/test/utils";
import { seedUsers, type UsersInfo } from "@/test/functions/seed-users";

let usersInfo: UsersInfo;
let group: Group;

test.beforeEach(async () => {
	usersInfo = await seedUsers();
	group = await usersInfo.requesters.harry.groups.create.mutate({ name: "First group" });
});

test("Request to non-existing group", async () => {
	await expect(usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: "12345678" })).resolves.toEqual({
		ok: false,
		error: "Group 12345678 does not exist"
	});
});

test("Request to existing group", async () => {
	expect(await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId })).toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([
		{
			id: expect.any(String),
			user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
		}
	]);

	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Invite", async () => {
	expect(await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userIds: [usersInfo.userIds.ron] })).toEqual([{ ok: true }]);

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([
		{
			id: expect.any(String),
			user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
		}
	]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});
