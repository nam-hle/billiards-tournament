import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { seedUser } from "@/test/functions/seed-user";
import { FULL_NAMES, DEFAULT_PASSWORD } from "@/test/utils";

test("Navigation", async ({ page }) => {
	await seedUser({ email: "harry", fullName: FULL_NAMES.harry });
	const navigationItems = page.locator('[data-testid^="navigation-item-"]');

	await page.goto("/");
	await expect(page).toHaveURL("/");

	await expect(navigationItems).toHaveCount(2);
	await expect(navigationItems.first()).toHaveText("Sign Up");
	await expect(navigationItems.last()).toHaveText("Login");

	await navigationItems.first().click();
	await page.goto("/signup");
	await expect(navigationItems).toHaveCount(0);

	await page.goto("/login");
	await expect(page).toHaveURL("/login");
	await expect(navigationItems).toHaveCount(0);

	await Actions.LoginForm.fillEmail(page, "harry@example.com");
	await Actions.LoginForm.fillPassword(page, DEFAULT_PASSWORD);
	await Actions.LoginForm.submit(page);

	await expect(page).toHaveURL("/dashboard");
	await expect(navigationItems).toHaveCount(7);
	await expect(navigationItems.nth(0)).toHaveText("Dashboard");

	await expect(navigationItems.nth(1)).toHaveText("Bills");
	await navigationItems.nth(1).click();
	await expect(page).toHaveURL("/bills");

	await expect(navigationItems.nth(2)).toHaveText("Transactions");
	await navigationItems.nth(2).click();
	await expect(page).toHaveURL("/transactions");

	await expect(navigationItems.nth(3)).toHaveText("Create");
	await navigationItems.nth(3).click();
	await expect(page).toHaveURL("/bills/new");

	await expect(page.locator(`[data-testid="navigation-item-group-switcher"]`)).toBeVisible();
	await expect(page.locator(`[data-testid="navigation-item-notifications"]`)).toBeVisible();
	await expect(page.locator(`[data-testid="navigation-item-profile"]`)).toBeVisible();

	await page.getByTestId("logo").click();

	await expect(page).toHaveURL("/");
	await expect(navigationItems).toHaveCount(2);
	await expect(navigationItems.first()).toHaveText("Dashboard");
	await expect(page.locator(`[data-testid="navigation-item-profile"]`)).toBeVisible();

	await navigationItems.first().click();
	await expect(page).toHaveURL("/dashboard");

	await page.locator(`[data-testid="navigation-item-profile"]`).click();
	await page.getByRole("menuitem", { name: "Log out" }).click();

	await expect(page).toHaveURL("/login");
	await expect(navigationItems).toHaveCount(0);

	await page.getByText("Sign up").click();
	await Actions.SignUpForm.fillDisplayName(page, FULL_NAMES.ron);
	await Actions.SignUpForm.fillEmail(page, "ron@example.com");
	await Actions.SignUpForm.fillEmail(page, "ron@example.com");
	await Actions.fillInput(page, "password", DEFAULT_PASSWORD);
	await Actions.SignUpForm.fillConfirmPassword(page, DEFAULT_PASSWORD);
	await Actions.SignUpForm.submit(page);

	await expect(page).toHaveURL("/profile");
	await expect(navigationItems).toHaveCount(7);
});
