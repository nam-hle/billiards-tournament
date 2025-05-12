import { truncate } from "@/test/functions/truncate";
import { seedUsers } from "@/test/functions/seed-users";
import { BANKS, USERNAMES, FULL_NAMES, type UserName, type GroupName } from "@/test/utils";
import { type Group, type Membership, BankAccountTypeEnumSchema, BankAccountStatusEnumSchema } from "@/schemas";

const findInvitations = (memberships: Membership[], userId: string) => memberships.find((invitation) => invitation.user.userId === userId)!;

export type BasicPreset = Awaited<ReturnType<typeof seedBasicPreset>>;

export async function seedBasicPreset(options?: { withBankAccounts?: boolean }) {
	try {
		await truncate();
		const usersInfo = await seedUsers();

		// Setup Gryffindor group
		const gryffindorGroup = await usersInfo.requesters.harry.groups.create.mutate({ name: "Gryffindor" });
		await usersInfo.requesters.harry.user.selectGroup.mutate({ groupId: gryffindorGroup.id });

		await usersInfo.requesters.harry.groups.invite.mutate({
			groupId: gryffindorGroup.id,
			userIds: [usersInfo.userIds.ron, usersInfo.userIds.hermione]
		});

		const gryffindorMemberships = await usersInfo.requesters.harry.groups.invitations.query({ groupId: gryffindorGroup.id });

		await usersInfo.requesters.ron.groups.acceptInvitation.mutate({
			invitationId: findInvitations(gryffindorMemberships, usersInfo.userIds.ron).id
		});
		await usersInfo.requesters.hermione.groups.acceptInvitation.mutate({
			invitationId: findInvitations(gryffindorMemberships, usersInfo.userIds.hermione).id
		});

		// Setup Hogwarts group
		const hogwartsGroup = await usersInfo.requesters.dumbledore.groups.create.mutate({ name: "Hogwarts" });
		await usersInfo.requesters.dumbledore.groups.invite.mutate({
			groupId: hogwartsGroup.id,
			userIds: [usersInfo.userIds.harry, usersInfo.userIds.ron, usersInfo.userIds.hermione, usersInfo.userIds.snape]
		});

		const hogwartsMemberships = await usersInfo.requesters.dumbledore.groups.invitations.query({ groupId: hogwartsGroup.id });
		await usersInfo.requesters.harry.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.harry).id
		});
		await usersInfo.requesters.ron.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.ron).id
		});
		await usersInfo.requesters.hermione.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.hermione).id
		});
		await usersInfo.requesters.snape.groups.acceptInvitation.mutate({
			invitationId: findInvitations(hogwartsMemberships, usersInfo.userIds.snape).id
		});

		for (const requester of Object.values(usersInfo.requesters)) {
			await requester.user.selectGroup.mutate({ groupId: hogwartsGroup.id });
		}

		// @ts-expect-error Force type conversion
		const bankAccounts: Record<UserName, string[]> = {};

		if (options?.withBankAccounts) {
			let index = 0;

			for (const username of Object.values(USERNAMES)) {
				const requester = usersInfo.requesters[username];

				const bankAccountIds = await Promise.all(
					Object.values(BANKS).map((bank) =>
						requester.user.addBankAccount.mutate({
							providerNumber: bank.id,
							accountNumber: "10000" + index++,
							type: BankAccountTypeEnumSchema.enum.Bank,
							status: BankAccountStatusEnumSchema.enum.Active,
							accountHolder: `${FULL_NAMES[username]} ${bank.name}`.toUpperCase()
						})
					)
				);

				bankAccounts[username] = bankAccountIds.map((e) => e.id);
			}
		}

		const groups: Record<GroupName, Group> = { Hogwarts: hogwartsGroup, Gryffindor: gryffindorGroup };

		return { ...usersInfo, groups, bankAccounts };
	} catch (error) {
		console.error("Error while setup basic preset:", error);
		throw error;
	}
}
