import { test, expect } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { truncate } from "@/test/functions/truncate";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

test.beforeAll("Setup", async () => {
	await truncate();
	await seedBasicPreset({ withBankAccounts: true });
});

test.beforeEach(async ({ page }) => {
	await Actions.login(page, USERNAMES.harry);
	await Actions.goToTransactionsPage(page);
	await page.getByRole("link", { name: "New" }).click();
});

test.describe("validation", () => {
	test("Empty form", async ({ page }) => {
		await Actions.TransactionForm.next(page);

		await expect(Locators.locateErrors(page)).toHaveCount(3);
		await expect(Locators.locateError(page, "receiverId")).toHaveText("Receiver is required");
		await expect(Locators.locateError(page, "bankAccountId")).toHaveText("Bank account is required");
		await expect(Locators.locateError(page, "amount")).toHaveText("Amount is required");
	});

	test("Receiver", async ({ page }) => {
		await Actions.TransactionForm.next(page);
		await Actions.TransactionForm.selectReceiver(page, FULL_NAMES.ron);

		await expect(Locators.locateErrors(page)).toHaveCount(2);
		await expect(Locators.locateError(page, "bankAccountId")).toHaveText("Bank account is required");
		await expect(Locators.locateError(page, "amount")).toHaveText("Amount is required");
	});

	test("Bank account", async ({ page }) => {
		await Actions.TransactionForm.next(page);
		await Actions.TransactionForm.selectReceiver(page, FULL_NAMES.ron);
		await Actions.TransactionForm.selectAccount(page, `${FULL_NAMES.ron} BIDV (BIDV 100000)`);

		await expect(Locators.locateErrors(page)).toHaveCount(1);
		await expect(Locators.locateError(page, "amount")).toHaveText("Amount is required");
	});

	test("Amount", async ({ page }) => {
		await Actions.TransactionForm.next(page);
		await expect(Locators.locateError(page, "amount")).toHaveText("Amount is required");

		await Actions.TransactionForm.fillAmount(page, "-123000");
		await expect(Locators.locateError(page, "amount")).toHaveText("The amount must be a number greater than zero");
	});
});
