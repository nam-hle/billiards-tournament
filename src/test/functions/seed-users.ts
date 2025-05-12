import { seedUser } from "@/test/functions/seed-user";
import { type Requester, createRequester } from "@/test/helpers/requester";
import { USERNAMES, FULL_NAMES, type FullName, type UserName } from "@/test/utils";

export type UsersInfo = Awaited<ReturnType<typeof seedUsers>>;

export async function seedUsers() {
	const userIds: Record<string, string> = {};
	const userNames: Record<string, string> = {};
	const requesters: Record<string, Requester> = {};

	for (const username of Object.values(USERNAMES)) {
		userIds[username] = await seedUser({ email: username, fullName: FULL_NAMES[username] });
		userNames[FULL_NAMES[username]] = userIds[username];
		requesters[username] = await createRequester(username);
	}

	return {
		userIds: userIds as Record<UserName, string>,
		userNames: userNames as Record<FullName, string>,
		requesters: requesters as Record<UserName, Requester>
	};
}
