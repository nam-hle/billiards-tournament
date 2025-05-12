import { test, expect } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

test.beforeAll("Setup", async () => {
	await seedBasicPreset();
});

test.beforeEach(async ({ page }) => {
	await Actions.login(page, USERNAMES.harry);
	await Actions.goToBillsPage(page);
	await page.getByRole("link", { name: "New" }).click();
});

test.describe("validation", () => {
	test("Empty form", async ({ page }) => {
		await Actions.submit(page);

		await expect(Locators.locateErrors(page)).toHaveCount(4);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");
	});

	test("Description", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.fillDescription(page, "Dinner");

		await expect(Locators.locateErrors(page)).toHaveCount(3);
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");

		await Actions.BillForm.fillDescription(page, "");
		await expect(Locators.locateErrors(page)).toHaveCount(4);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");
	});

	test("Creditor", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.selectCreditor(page, FULL_NAMES.ron);

		await expect(Locators.locateErrors(page)).toHaveCount(3);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");
	});

	test("Total amount", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.fillCreditorAmount(page, "90000");

		await expect(Locators.locateErrors(page)).toHaveCount(3);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");

		await Actions.BillForm.fillCreditorAmount(page, "");

		await expect(Locators.locateErrors(page)).toHaveCount(4);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");

		await Actions.BillForm.fillCreditorAmount(page, "abc");

		await expect(Locators.locateErrors(page)).toHaveCount(4);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");
	});

	test("Debtor", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.selectDebtor(page, 0, FULL_NAMES.hermione);

		await expect(Locators.locateErrors(page)).toHaveCount(3);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
	});

	test("Split amount", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.fillDebtorAmount(page, 0, "abc");

		await expect(Locators.locateErrors(page)).toHaveCount(4);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");

		await Actions.BillForm.fillDebtorAmount(page, 0, "45000");

		await expect(Locators.locateErrors(page)).toHaveCount(4);
		await expect(Locators.locateError(page, "description")).toHaveText("Description is required");
		await expect(Locators.locateError(page, "creditor.userId")).toHaveText("Creditor is required");
		await expect(Locators.locateError(page, "creditor.amount")).toHaveText("Total amount is required");
		await expect(Locators.locateError(page, "debtors.0.userId")).toHaveText("Debtor is required");
	});
});
