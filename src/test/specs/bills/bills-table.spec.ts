import { type TRPCClient } from "@trpc/client";
// Import from playwright instead of the setup file to avoid truncate function
import { test, expect, type Page } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { type AppRouter } from "@/routers/app.router";
import { Assertions } from "@/test/helpers/assertions";
import { createRequester } from "@/test/helpers/requester";
import { type TableLocator } from "@/test/locators/table-locator";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";
import { USERNAMES, FULL_NAMES, getCurrentDate, type BillMember } from "@/test/utils";

const presetBills: Omit<Actions.BillForm.FillParams, "description">[] = [
	{
		creditor: { amount: "90000", name: FULL_NAMES.harry },
		debtors: [
			{ amount: "20000", name: FULL_NAMES.ron },
			{ amount: "70000", name: FULL_NAMES.hermione }
		]
	},
	{
		creditor: { amount: "90000", name: FULL_NAMES.ron },
		debtors: [
			{ amount: "20000", name: FULL_NAMES.harry },
			{ amount: "70000", name: FULL_NAMES.hermione }
		]
	},
	{
		creditor: { amount: "90000", name: FULL_NAMES.hermione },
		debtors: [
			{ amount: "20000", name: FULL_NAMES.harry },
			{ amount: "70000", name: FULL_NAMES.ron }
		]
	}
];

const expectedRows: Assertions.BillsTableExpectation["rows"] = [
	{
		description: "Breakfast 0",
		creditor: { amount: "90.000", name: FULL_NAMES.harry },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.ron },
			{ amount: "70.000", name: FULL_NAMES.hermione }
		]
	},
	{
		description: "Breakfast 1",
		creditor: { amount: "90.000", name: FULL_NAMES.ron },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "70.000", name: FULL_NAMES.hermione }
		]
	},
	{
		description: "Breakfast 2",
		creditor: { amount: "90.000", name: FULL_NAMES.hermione },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "70.000", name: FULL_NAMES.ron }
		]
	},
	{
		description: "Lunch 3",
		creditor: { amount: "90.000", name: FULL_NAMES.harry },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.ron },
			{ amount: "70.000", name: FULL_NAMES.hermione }
		]
	},
	{
		description: "Lunch 4",
		creditor: { amount: "90.000", name: FULL_NAMES.ron },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "70.000", name: FULL_NAMES.hermione }
		]
	},
	{
		description: "Lunch 5",
		creditor: { amount: "90.000", name: FULL_NAMES.hermione },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "70.000", name: FULL_NAMES.ron }
		]
	},
	{
		description: "Dinner 6",
		creditor: { amount: "90.000", name: FULL_NAMES.harry },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.ron },
			{ amount: "70.000", name: FULL_NAMES.hermione }
		]
	},
	{
		description: "Dinner 7",
		creditor: { amount: "90.000", name: FULL_NAMES.ron },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "70.000", name: FULL_NAMES.hermione }
		]
	},
	{
		description: "Dinner 8",
		creditor: { amount: "90.000", name: FULL_NAMES.hermione },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "70.000", name: FULL_NAMES.ron }
		]
	},
	{
		description: "Party",
		creditor: { amount: "90.000", name: FULL_NAMES.harry },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.harry },
			{ amount: "30.000", name: FULL_NAMES.ron },
			{ amount: "40.000", name: FULL_NAMES.hermione }
		]
	}
];

test.beforeAll("Seed bills", async () => {
	const { userNames } = await seedBasicPreset({});

	await test.step("Ron creates bills", async () => {
		const requester = await createRequester(USERNAMES.ron);

		for (const index of [0, 1, 2]) {
			await requester.bills.create.mutate(toCreationPayload({ ...presetBills[index % 3], description: `Breakfast ${index}` }));
		}
	});

	await test.step("Hermione creates bills", async () => {
		const requester = await createRequester(USERNAMES.hermione);

		for (const index of [3, 4, 5]) {
			await requester.bills.create.mutate(toCreationPayload({ ...presetBills[index % 3], description: `Lunch ${index}` }));
		}
	});

	await test.step("Harry creates bills", async () => {
		const requester = await createRequester(USERNAMES.harry);

		for (const index of [6, 7, 8]) {
			await requester.bills.create.mutate(toCreationPayload({ ...presetBills[index % 3], description: `Dinner ${index}` }));
		}
	});

	await test.step("Ron creates a bill with Hermione only", async () => {
		const requester = await createRequester(USERNAMES.ron);

		await requester.bills.create.mutate(
			toCreationPayload({
				description: `Coffee`,
				creditor: { amount: "90000", name: FULL_NAMES.ron },
				debtors: [
					{ amount: "20000", name: FULL_NAMES.ron },
					{ amount: "70000", name: FULL_NAMES.hermione }
				]
			})
		);
	});

	await test.step("Harry creates a self bill", async () => {
		const requester = await createRequester(USERNAMES.harry);

		await requester.bills.create.mutate(
			toCreationPayload({
				description: `Party`,
				creditor: { amount: "90000", name: FULL_NAMES.harry },
				debtors: [
					{ amount: "20000", name: FULL_NAMES.harry },
					{ amount: "30000", name: FULL_NAMES.ron },
					{ amount: "40000", name: FULL_NAMES.hermione }
				]
			})
		);
	});

	function toCreationPayload(bill: Actions.BillForm.FillParams): Parameters<TRPCClient<AppRouter>["bills"]["create"]["mutate"]>[0] {
		const fromMember = (member: BillMember) => ({
			userId: userNames[member.name],
			amount: parseInt(member.amount)
		});

		return {
			...bill,
			receiptFile: null,
			issuedAt: getCurrentDate(),
			creditor: fromMember(bill.creditor),
			debtors: bill.debtors.map(fromMember)
		};
	}
});

test.beforeEach(async ({ page }) => {
	await Actions.login(page, USERNAMES.harry);
	await Actions.goToBillsPage(page);
});

test.afterEach(async ({ page }) => {
	await Actions.logout(page);
});

async function waitForLoading(page: Page, action: () => Promise<void>) {
	await action();
	await page.waitForTimeout(1000);
}

export const testBillsPage = test.extend<{
	billsTableLocator: TableLocator;
}>({
	billsTableLocator: async ({ page }, use) => {
		await use(await Locators.locateTable(page, 0));
	}
});

testBillsPage("Pagination", async ({ page, billsTableLocator }) => {
	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (10)",
		pagination: { totalPages: 2, currentPage: 1 },
		rows: [expectedRows[9], expectedRows[8], expectedRows[7], expectedRows[6], expectedRows[5]]
	});

	await waitForLoading(page, () => billsTableLocator.nextPageButton.click());
	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (10)",
		pagination: { totalPages: 2, currentPage: 2 },
		rows: [expectedRows[4], expectedRows[3], expectedRows[2], expectedRows[1], expectedRows[0]]
	});
	await expect(page).toHaveURL("/bills?page=2");
});

testBillsPage("Creator filter", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creator" }).click());
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (4)",
		rows: [expectedRows[9], expectedRows[8], expectedRows[7], expectedRows[6]]
	});

	await expect(page).toHaveURL("/bills?creator=me");
});

testBillsPage("Creditor filter", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creditor" }).click());
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (4)",
		rows: [expectedRows[9], expectedRows[6], expectedRows[3], expectedRows[0]]
	});

	await expect(page).toHaveURL("/bills?creditor=me");
});

testBillsPage("Debtor filter", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (7)",
		pagination: { totalPages: 2, currentPage: 1 },
		rows: [expectedRows[9], expectedRows[8], expectedRows[7], expectedRows[5], expectedRows[4]]
	});
	await expect(page).toHaveURL("/bills?debtor=me");

	await waitForLoading(page, () => billsTableLocator.nextPageButton.click());
	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (7)",
		rows: [expectedRows[2], expectedRows[1]],
		pagination: { totalPages: 2, currentPage: 2 }
	});
	await expect(page).toHaveURL("/bills?page=2&debtor=me");

	await waitForLoading(page, () => page.getByRole("button", { name: "As creditor" }).click());
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (1)",
		rows: [expectedRows[9]]
	});
	await expect(page).toHaveURL("/bills?debtor=me&creditor=me");
});

testBillsPage("Creditor & Debtor filters", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creditor" }).click());
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (1)",
		rows: [expectedRows[9]]
	});

	await expect(page).toHaveURL("/bills?creditor=me&debtor=me");
});

testBillsPage("Creator & Debtor filters", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creator" }).click());
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (3)",
		rows: [expectedRows[9], expectedRows[8], expectedRows[7]]
	});

	await expect(page).toHaveURL("/bills?creator=me&debtor=me");
});

testBillsPage("Search", async ({ page, billsTableLocator }) => {
	await Actions.fillInput(page, "search-bar", "break");
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (3)",
		rows: [expectedRows[2], expectedRows[1], expectedRows[0]]
	});

	await expect(page).toHaveURL("/bills?q=break");
});

testBillsPage("Search & Filter", async ({ page, billsTableLocator }) => {
	await Actions.fillInput(page, "search-bar", "break");
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (2)",
		rows: [expectedRows[2], expectedRows[1]]
	});

	await expect(page).toHaveURL("/bills?q=break&debtor=me");
});

testBillsPage("Navigate with query", async ({ page, billsTableLocator }) => {
	await page.goto("/bills?debtor=me&page=2");

	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (7)",
		rows: [expectedRows[2], expectedRows[1]],
		pagination: { totalPages: 2, currentPage: 2 }
	});
});

testBillsPage("Balance", async ({ page }) => {
	await Actions.goToDashboardPage(page);

	await Assertions.assertStats(page, { Paid: "340.000", Owed: "120.000", "Net Balance": "220.000" });
});
