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

	expect(invites).toEqual([
		{
			id: expect.any(String),
			user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
		}
	]);

	inviteId = invites[0].id;
});

test("Request", async () => {
	expect(await usersInfo.requesters.ron.groups.request.mutate({ groupDisplayId: group.displayId })).toEqual({
		ok: false,
		error: "You have already received an invitation to join this group. Please check your pending invitations."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([
		{ id: inviteId, user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) } }
	]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Accept the request", async () => {
	await expect(usersInfo.requesters.harry.groups.acceptRequest.mutate({ requestId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already invited. Please wait for the response."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([
		{ id: inviteId, user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) } }
	]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Reject the request", async () => {
	await expect(usersInfo.requesters.harry.groups.rejectRequest.mutate({ requestId: inviteId })).resolves.toEqual({
		ok: false,
		error: "User is already invited. Please wait for the response."
	});

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([
		{ id: inviteId, user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) } }
	]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Invite again", async () => {
	expect(await usersInfo.requesters.harry.groups.invite.mutate({ groupId: group.id, userIds: [usersInfo.userIds.ron] })).toEqual([
		{ ok: false, error: "User is already invited" }
	]);

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([
		{ id: inviteId, user: { avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) } }
	]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});

test("Accept the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.acceptInvitation.mutate({ invitationId: inviteId })).resolves.toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry },
		{ avatarFile: null, fullName: FULL_NAMES.ron, userId: expect.any(String) }
	]);
});

test("Reject the invitation", async () => {
	await expect(usersInfo.requesters.ron.groups.rejectInvitation.mutate({ invitationId: inviteId })).resolves.toEqual({ ok: true });

	expect(await usersInfo.requesters.harry.groups.invitations.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.requests.query({ groupId: group.id })).toEqual([]);
	expect(await usersInfo.requesters.harry.groups.membersByGroupId.query({ groupId: group.id })).toEqual([
		{ avatarFile: null, userId: expect.any(String), fullName: FULL_NAMES.harry }
	]);
});
