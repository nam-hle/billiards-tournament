import test, { expect } from "@playwright/test";

import { capitalize } from "@/utils";
import { Actions } from "@/test/helpers/actions";
import { USERNAMES, getCurrentDate } from "@/test/utils";
import { createRequester } from "@/test/helpers/requester";
import { selectGroup } from "@/test/functions/select-group";
import { seedBasicPreset, type BasicPreset } from "@/test/functions/seed-basic-preset";

let preset: BasicPreset;
let url: string;

test.beforeAll(async () => {
	preset = await seedBasicPreset({ withBankAccounts: true });

	const requester = await createRequester(USERNAMES.harry);

	await requester.user.selectGroup.mutate({ groupId: preset.groups.Gryffindor.id });
	const { displayId } = await requester.transactions.create.mutate({
		amount: 40,
		issuedAt: getCurrentDate(),
		receiverId: preset.userIds.ron,
		bankAccountId: preset.bankAccounts.ron[0]
	});

	url = `/transactions/${displayId}`;
});

test.beforeEach(async () => {
	await selectGroup(preset);
});

test.afterEach(async ({ page }) => {
	await Actions.logout(page, { viaCookie: true });
});

test.describe("Transactions Page", () => {
	const url = "/transactions";
	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(url);

		await expect(page).toHaveURL("/login");
	});

	test("Show selection group message if not select group", async ({ page }) => {
		await selectGroup(preset, { harry: null });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Group Selection Required")).toBeVisible();
	});

	test("Show no transactions when select Hogwarts group", async ({ page }) => {
		await selectGroup(preset, { harry: "Hogwarts" });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Transactions (0)")).toBeVisible();
	});

	test("Show one transaction when select Gryffindor group", async ({ page }) => {
		await selectGroup(preset, { harry: "Gryffindor" });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Transactions (1)")).toBeVisible();
	});
});

test.describe("Create Transaction Page", () => {
	const url = "/transactions/new";

	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(url);

		await expect(page).toHaveURL("/login");
	});

	test("Show selection group message if not select group", async ({ page }) => {
		await selectGroup(preset, { harry: null });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Group Selection Required")).toBeVisible();
	});
});

test.describe("Transaction Details Page", () => {
	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(url);

		await expect(page).toHaveURL("/login");
	});

	test("Users outside the group can not access the page", async ({ page }) => {
		await Actions.login(page, USERNAMES.snape);
		await page.goto(url);

		await expect(page.getByText("Access Denied")).toBeVisible();
	});

	[USERNAMES.harry, USERNAMES.ron, USERNAMES.hermione].forEach((username) => {
		test(`${capitalize(username)} as a group members can access the page but require select that group`, async ({ page }) => {
			await preset.requesters[username].user.selectGroup.mutate({ groupId: null });
			await Actions.login(page, username);
			await page.goto(url);

			await expect(page.getByText("Switch Group Required")).toBeVisible();
			await expect(page.getByText("Transaction Details")).not.toBeVisible();

			await preset.requesters[username].user.selectGroup.mutate({ groupId: preset.groups.Gryffindor.id });
			await page.reload();

			await expect(page.getByText("Switch Group Required")).not.toBeVisible();
			await expect(page.getByText("Transaction Details")).toBeVisible();
		});
	});
});
