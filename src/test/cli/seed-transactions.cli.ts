#!/usr/bin/env tsx

import { USERNAMES, getCurrentDate } from "@/test/utils";
import { createRequester } from "@/test/helpers/requester";

export async function seedTransactions(): Promise<void> {
	const harryRequester = await createRequester(USERNAMES.harry);
	const ronRequester = await createRequester(USERNAMES.ron);

	const harryProfile = await harryRequester.user.profile.query();

	const harryAccounts = await ronRequester.user.bankAccounts.query({ userId: harryProfile.userId });

	for (let amount = 40; amount <= 80; amount++) {
		await ronRequester.transactions.create.mutate({
			amount,
			issuedAt: getCurrentDate(),
			receiverId: harryProfile.userId,
			bankAccountId: harryAccounts[0].id
		});
	}
}

seedTransactions();
