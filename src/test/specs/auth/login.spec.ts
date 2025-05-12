import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { seedUser } from "@/test/functions/seed-user";
import { FULL_NAMES, DEFAULT_PASSWORD } from "@/test/utils";

test("Login", async ({ page }) => {
	await Actions.goToHomePage(page);

	await expect(page).toHaveURL("/");

	await page.getByText("Login").click();

	await Actions.LoginForm.submit(page);
	await expect(page.getByText("Email is require")).toBeVisible();
	await expect(page.getByText("Password is required")).toBeVisible();

	await Actions.LoginForm.fillEmail(page, "harry@example.com");
	await expect(page.getByText("Email is require")).not.toBeVisible();

	await Actions.LoginForm.fillPassword(page, "1234");
	await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();

	await Actions.fillInput(page, "password", DEFAULT_PASSWORD);
	await expect(page.getByText("Password must be at least 6 characters")).not.toBeVisible();

	await Actions.LoginForm.submit(page);

	await expect(page.getByTestId("form-root-error")).toHaveText("Invalid login credentials");

	await seedUser({ email: "harry", fullName: FULL_NAMES.harry });

	await Actions.submit(page);

	await expect(page).toHaveURL("/dashboard");
	await expect(page.locator("h3").first()).toHaveText("Group Selection Required");
});
