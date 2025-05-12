import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { Assertions } from "@/test/helpers/assertions";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";
import { USERNAMES, FULL_NAMES, getCurrentDate } from "@/test/utils";

test("basic", async ({ page }) => {
	const { userIds, requesters, bankAccounts } = await seedBasicPreset({ withBankAccounts: true });

	await test.step("Create transactions from Ron to Harry", async () => {
		await requesters.ron.transactions.create.mutate({
			amount: 40000,
			receiverId: userIds.harry,
			issuedAt: getCurrentDate(),
			bankAccountId: bankAccounts.harry[0]
		});
		await requesters.ron.transactions.create.mutate({
			amount: 41000,
			receiverId: userIds.harry,
			issuedAt: getCurrentDate(),
			bankAccountId: bankAccounts.harry[1]
		});
	});

	await test.step("Create transactions from Hermione to Harry", async () => {
		await requesters.hermione.transactions.create.mutate({
			amount: 42000,
			receiverId: userIds.harry,
			issuedAt: getCurrentDate(),
			bankAccountId: bankAccounts.harry[0]
		});
		await requesters.hermione.transactions.create.mutate({
			amount: 43000,
			receiverId: userIds.harry,
			issuedAt: getCurrentDate(),
			bankAccountId: bankAccounts.harry[0]
		});
	});

	await test.step("Create transactions from Harry to others", async () => {
		await requesters.harry.transactions.create.mutate({
			amount: 44000,
			receiverId: userIds.ron,
			issuedAt: getCurrentDate(),
			bankAccountId: bankAccounts.ron[0]
		});
		await requesters.harry.transactions.create.mutate({
			amount: 45000,
			issuedAt: getCurrentDate(),
			receiverId: userIds.hermione,
			bankAccountId: bankAccounts.hermione[0]
		});
	});

	await Actions.login(page, USERNAMES.harry);

	await page.getByRole("link", { name: "Transactions" }).click();
	const transactionsTable = await Locators.locateTable(page, 0);

	const firstRows = [
		{ amount: "40.000", status: "Waiting", action: "Confirm", issuedAt: "Today", sender: FULL_NAMES.ron, receiver: FULL_NAMES.harry },
		{ amount: "41.000", status: "Waiting", action: "Confirm", issuedAt: "Today", sender: FULL_NAMES.ron, receiver: FULL_NAMES.harry },
		{ amount: "42.000", status: "Waiting", action: "Confirm", issuedAt: "Today", receiver: FULL_NAMES.harry, sender: FULL_NAMES.hermione },
		{ amount: "43.000", status: "Waiting", action: "Confirm", issuedAt: "Today", receiver: FULL_NAMES.harry, sender: FULL_NAMES.hermione },
		{ amount: "44.000", status: "Waiting", action: "Decline", issuedAt: "Today", receiver: FULL_NAMES.ron, sender: FULL_NAMES.harry }
	];
	await Assertions.assertTransactionsTable(transactionsTable, {
		rows: firstRows,
		heading: "Transactions (6)",
		pagination: {
			totalPages: 2,
			currentPage: 1
		}
	});

	await transactionsTable.nextPageButton.click();

	await Assertions.assertTransactionsTable(transactionsTable, {
		heading: "Transactions (6)",
		pagination: {
			totalPages: 2,
			currentPage: 2
		},
		rows: [{ amount: "45.000", status: "Waiting", issuedAt: "Today", sender: FULL_NAMES.harry, receiver: FULL_NAMES.hermione }]
	});

	await Actions.goToDashboardPage(page);
	await Assertions.assertStats(page, { Sent: "89.000", Received: "166.000", "Net Balance": "77.000" });
	// TODO: Enable
	// const recentTable = await Locators.locateTable(page, 1);
	// await Assertions.assertTransactionsTable(recentTable, { pagination: null, rows: firstRows.map((row) => _.omit(row, "action")) });

	await Actions.goToNotificationsPage(page);
	await Assertions.assertNotificationsTable(page, {
		messages: [
			`You have received a new transaction of 43.000 from Hermione Granger. Please review and confirm it.`,
			`You have received a new transaction of 42.000 from Hermione Granger. Please review and confirm it.`,
			`You have received a new transaction of 41.000 from Ron Weasley. Please review and confirm it.`,
			`You have received a new transaction of 40.000 from Ron Weasley. Please review and confirm it.`
		]
	});
});
