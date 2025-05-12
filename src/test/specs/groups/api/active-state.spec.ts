import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { type Group } from "@/schemas";
import { FULL_NAMES } from "@/test/utils";
import { seedUsers, type UsersInfo } from "@/test/functions/seed-users";

let usersInfo: UsersInfo;
let group: Group;
let inviteId: string;

test.beforeEach(async () => {
	usersInfo = await seedUsers();
	group = await usersInfo.requesters.harry.groups.create.mutate({ name: "First group" });
	await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userIds: [usersInfo.userIds.ron] });

	const invites = await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id });
	inviteId = invites[0].id;

	await usersInfo.requesters.ron.groups.acceptInvitation.mutate({ invitationId: inviteId });

	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Request", async () => {
	expect(await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId })).toEqual({
		ok: false,
		error: "You are already a member of this group and do not need to send a request."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Accept the request", async () => {
	await expect(usersInfo.requesters.harry.groups.acceptRequest.mutate({ requestId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Reject the request", async () => {
	await expect(usersInfo.requesters.harry.groups.rejectRequest.mutate({ requestId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Invite ", async () => {
	expect(await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userIds: [usersInfo.userIds.ron] })).toEqual([
		{
			ok: false,
			error: "User is already a member."
		}
	]);

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Accept the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.acceptInvitation.mutate({ invitationId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Reject the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.rejectInvitation.mutate({ invitationId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already a member."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});
