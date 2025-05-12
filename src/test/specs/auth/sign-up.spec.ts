import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { FULL_NAMES, DEFAULT_PASSWORD } from "@/test/utils";

test("Sign up", async ({ page }) => {
	await Actions.goToDashboardPage(page);
	await expect(page).toHaveURL("/login");

	await page.getByText("Sign up").click();
	await expect(page).toHaveURL("/signup");

	await Actions.SignUpForm.submit(page);
	await expect(page.getByText("Display name is required")).toBeVisible();
	await expect(page.getByText("Email is required")).toBeVisible();
	await expect(page.getByText("Password is required", { exact: true })).toBeVisible();
	await expect(page.getByText("Confirm password is required")).toBeVisible();

	await Actions.SignUpForm.fillDisplayName(page, FULL_NAMES.harry);
	await expect(page.getByText("Display name is required")).not.toBeVisible();

	await Actions.SignUpForm.fillEmail(page, "harry");
	await expect(page.getByText("Invalid email address")).toBeVisible();

	await Actions.SignUpForm.fillEmail(page, "harry@example.com");
	await expect(page.getByText("Invalid email address")).not.toBeVisible();

	await Actions.SignUpForm.fillPassword(page, "1234");
	await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();

	await Actions.fillInput(page, "password", DEFAULT_PASSWORD);
	await expect(page.getByText("Password must be at least 6 characters")).not.toBeVisible();

	await Actions.SignUpForm.fillConfirmPassword(page, "1234");
	await expect(page.getByText("Passwords do not match")).toBeVisible();

	await Actions.SignUpForm.fillConfirmPassword(page, DEFAULT_PASSWORD);
	await expect(page.getByText("Passwords do not match")).not.toBeVisible();

	await Actions.SignUpForm.submit(page);
	await expect(page).toHaveURL("/profile");

	await Actions.logout(page);
	await Actions.goToSignUpPage(page);
	await Actions.SignUpForm.fillDisplayName(page, FULL_NAMES.harry);
	await Actions.SignUpForm.fillEmail(page, "harry@example.com");
	await Actions.fillInput(page, "password", DEFAULT_PASSWORD);
	await Actions.SignUpForm.fillConfirmPassword(page, DEFAULT_PASSWORD);
	await Actions.SignUpForm.submit(page);

	await expect(page.getByTestId("form-root-error")).toHaveText("User already registered");

	await page.getByText("Login here").click();
	await expect(page).toHaveURL("/login");

	await Actions.LoginForm.fillEmail(page, "harry@example.com");
	await Actions.fillInput(page, "password", DEFAULT_PASSWORD);
	await Actions.LoginForm.submit(page);

	await expect(page).toHaveURL("/dashboard");
	await expect(page.locator("h3").first()).toHaveText("Group Selection Required");
});
