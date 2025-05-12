import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { Assertions } from "@/test/helpers/assertions";
import { seedUsers } from "@/test/functions/seed-users";

test("Group Integration", async ({ page }) => {
	await seedUsers();

	await test.step("Harry creates group", async () => {
		await Actions.login(page, USERNAMES.harry);
		await Actions.goToGroupsPage(page);
		await page.getByRole("button", { name: "New" }).click();

		await expect(page.getByRole("dialog", { name: "Create Group" }).getByRole("heading", { name: "Create Group" })).toBeVisible();

		await page.getByRole("dialog").getByRole("textbox", { name: "Name" }).fill("Gryffindor");

		await page.getByRole("button", { name: "Create" }).click();
		await Assertions.assertToast(page, "New group has been created.");
	});

	await test.step("Assert groups table", async () => {
		const groupsTable = await Locators.locateTable(page, 0);
		await groupsTable.waitForLoading();

		const firstRow = groupsTable.getRow(0);
		await firstRow.getCell("Group Name").assertEqual("Gryffindor");
		await firstRow.getCell("Group ID").assertEqual(/^\d{8}$/);

		const membersCellLocator = firstRow.getCell("Members").locator;
		await expect(membersCellLocator.getByTestId("avatar")).toHaveCount(1);
		await expect(membersCellLocator.locator(`[data-testid="avatar-fallback"][title="${FULL_NAMES.harry}"]`)).toBeVisible();

		await page.waitForTimeout(2000);
		await firstRow.click();
	});

	let gryffindorGroupId: string;

	await test.step("Harry invites Ron and Hermione", async () => {
		await expect(page).toHaveURL(/\/groups\/\d{8}$/);

		gryffindorGroupId = page.url().split("/groups/")[1];

		await expect(page.getByRole("textbox").first()).toHaveAttribute("value", gryffindorGroupId);

		await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("Gryffindor");

		await expect(page.getByText("Members (1)")).toBeVisible();
		await expect(page.getByText("Requests (0)")).toBeVisible();
		await expect(page.getByText("Invitations (0)")).toBeVisible();

		await page.getByRole("tab", { name: "Invitations (0)" }).click();
		await page.getByRole("button", { name: "Invite" }).click();
		await page.getByText("Search by name...").click();
		await page.getByPlaceholder("Type to search...").fill("ro");
		await page.getByRole("option", { name: FULL_NAMES.ron }).click();
		await page.getByRole("button", { name: "Send Invites" }).click();

		await Assertions.assertToast(page, "Send invites successfully");

		await page.getByRole("button", { name: "Invite" }).click();
		await page.getByText("Search by name...").click();
		await page.getByPlaceholder("Type to search...").fill("he");
		await page.getByRole("option", { name: FULL_NAMES.hermione }).click();
		await page.getByRole("button", { name: "Send Invites" }).click();

		await Assertions.assertToast(page, "Send invites successfully");
		await expect(page.getByText("Members (1)")).toBeVisible();
		await expect(page.getByText("Requests (0)")).toBeVisible();
		await expect(page.getByText("Invitations (2)")).toBeVisible();
		await expect(page.getByTestId("user-display").nth(0)).toContainText(FULL_NAMES.ron);
		await expect(page.getByTestId("user-display").nth(1)).toContainText(FULL_NAMES.hermione);

		await Actions.logout(page);
	});

	await test.step("Ron accepts the invitation", async () => {
		await Actions.login(page, USERNAMES.ron);
		await Actions.goToGroupsPage(page);
		await expect(page.getByText("You have no groups yet")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();
		await expect(page.getByText("Invites (1)")).toBeVisible();

		const invitationsTable = await Locators.locateTable(page, 2);
		await invitationsTable.waitForLoading();

		const firstInvitation = invitationsTable.getRow(0);
		await firstInvitation.getCell("Group Name").assertEqual("Gryffindor");
		await expect(firstInvitation.getCell(2).locator.getByRole("button")).toHaveCount(2);

		await page.getByRole("button", { name: "Accept" }).click();

		await Assertions.assertToast(page, "You have successfully joined the group!");
		await expect(page.getByText("Groups (1)")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();
		await expect(page.getByText("You have no invites yet")).toBeVisible();

		const groupsTable = await Locators.locateTable(page, 0);
		await groupsTable.waitForLoading();
		const firstGroup = groupsTable.getRow(0);
		await firstGroup.getCell("Group Name").assertEqual("Gryffindor");
		const membersCellLocator = firstGroup.getCell("Members").locator;
		await expect(membersCellLocator.getByTestId("avatar")).toHaveCount(2);
		await expect(membersCellLocator.locator(`[data-testid="avatar-fallback"][title="${FULL_NAMES.harry}"]`)).toBeVisible();
		await expect(membersCellLocator.locator(`[data-testid="avatar-fallback"][title="${FULL_NAMES.ron}"]`)).toBeVisible();
	});

	await test.step("Ron tries to request to join Gryffindor again", async () => {
		await page.getByRole("button", { name: "Request" }).click();
		await page.getByPlaceholder("Enter group ID").fill("1234567");
		await page.getByRole("button", { name: "Send Request" }).click();

		await expect(Locators.locateError(page, "groupDisplayId")).toHaveText("Group 1234567 does not exist");

		await page.getByPlaceholder("Enter group ID").fill(gryffindorGroupId);
		await page.getByRole("button", { name: "Send Request" }).click();

		await expect(Locators.locateError(page, "groupDisplayId")).toHaveText(
			"You are already a member of this group and do not need to send a request."
		);

		await page.getByRole("button", { exact: true, name: "Close" }).click();
		await Actions.logout(page);
	});

	await test.step("Hermione reject the invitation", async () => {
		await Actions.login(page, USERNAMES.hermione);
		await Actions.goToGroupsPage(page);
		await expect(page.getByText("You have no groups yet")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();
		await expect(page.getByText("Invites (1)")).toBeVisible();

		await test.step("Hermione tries to request to join Gryffindor", async () => {
			await page.getByRole("button", { name: "Request" }).click();
			await page.getByPlaceholder("Enter group ID").fill(gryffindorGroupId);
			await page.getByRole("button", { name: "Send Request" }).click();

			await expect(Locators.locateError(page, "groupDisplayId")).toHaveText(
				"You have already received an invitation to join this group. Please check your pending invitations."
			);

			await page.keyboard.press("Escape");
		});

		const invitationsTable = await Locators.locateTable(page, 2);
		await invitationsTable.waitForLoading();

		const firstInvitation = invitationsTable.getRow(0);
		await firstInvitation.getCell("Group Name").assertEqual("Gryffindor");
		await expect(firstInvitation.getCell(2).locator.getByRole("button")).toHaveCount(2);

		await page.getByRole("button", { name: "Reject" }).click();

		await Assertions.assertToast(page, "You have successfully rejected the invitation!");
		await expect(page.getByText("You have no groups yet")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();
		await expect(page.getByText("You have no invites yet")).toBeVisible();

		await Actions.logout(page);
	});

	await test.step("Dumbledore requests to join", async () => {
		await Actions.login(page, USERNAMES.dumbledore);
		await Actions.goToGroupsPage(page);

		await expect(page.getByText("You have no groups yet")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();
		await expect(page.getByText("You have no invites yet")).toBeVisible();

		await page.getByRole("button", { name: "Request" }).click();
		await page.getByPlaceholder("Enter group ID").fill(gryffindorGroupId);
		await page.getByRole("button", { name: "Send Request" }).click();

		await expect(page.getByRole("dialog", { name: "Join a Group" })).not.toBeVisible();
		await Assertions.assertToast(page, "Your request to join the group has been sent successfully. Please wait for approval.");
		await expect(page.getByText("You have no groups yet")).toBeVisible();
		await expect(page.getByText("Requests (1)")).toBeVisible();
		await expect(page.getByText("You have no invites yet")).toBeVisible();

		const requestsTable = await Locators.locateTable(page, 1);
		await requestsTable.waitForLoading();

		const firstRequests = requestsTable.getRow(0);
		await firstRequests.getCell("Group Name").assertEqual("Gryffindor");

		await Actions.logout(page);
	});

	await test.step("Snape requests to join", async () => {
		await Actions.login(page, USERNAMES.snape);
		await Actions.goToGroupsPage(page);

		await page.getByRole("button", { name: "Request" }).click();
		await page.getByPlaceholder("Enter group ID").fill(gryffindorGroupId);
		await page.getByRole("button", { name: "Send Request" }).click();

		await Assertions.assertToast(page, "Your request to join the group has been sent successfully. Please wait for approval.");

		await page.getByRole("button", { name: "Request" }).click();
		await page.getByPlaceholder("Enter group ID").fill(gryffindorGroupId);
		await page.getByRole("button", { name: "Send Request" }).click();
		await expect(Locators.locateError(page, "groupDisplayId")).toHaveText(
			"Your request to join this group has already been submitted. Please wait for approval."
		);
		await page.getByRole("button", { exact: true, name: "Close" }).click();

		await Actions.logout(page);
	});

	await test.step("Harry responds to requests", async () => {
		await Actions.login(page, USERNAMES.harry);
		await Actions.goToGroupsPage(page);

		await expect(page.getByText("Groups (1)")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();
		await expect(page.getByText("You have no invites yet")).toBeVisible();

		const groupsTable = await Locators.locateTable(page, 0);
		await groupsTable.waitForLoading();

		await groupsTable.getRow(0).click();

		await expect(page.getByText("Members (2)")).toBeVisible();
		await expect(page.getByText("Requests (2)")).toBeVisible();
		await expect(page.getByText("Invitations (0)")).toBeVisible();

		await page.getByRole("tab", { name: "Requests (2)" }).click();

		const table = await Locators.locateTable(page, 0);
		await table.waitForLoading();

		const firstRow = table.getRow(0);
		await firstRow.getCell("Name").assertEqual(FULL_NAMES.dumbledore);
		await expect(firstRow.getCell(1).locator.getByRole("button")).toHaveCount(2);

		await firstRow.getCell(1).locator.getByRole("button", { name: "Accept" }).click();

		await Assertions.assertToast(page, "You have successfully accepted the request!");

		await firstRow.getCell(1).locator.getByRole("button", { name: "Reject" }).click();
		await Assertions.assertToast(page, "You have successfully rejected the request!");

		await expect(page.getByText("Members (3)")).toBeVisible();
		await expect(page.getByText("Requests (0)")).toBeVisible();
		await expect(page.getByText("Invitations (0)")).toBeVisible();
		await expect(page.getByText("You have no requests yet")).toBeVisible();

		await page.getByRole("tab", { name: "Members (3)" }).click();

		await table.getRow(0).getCell("Name").assertEqual(FULL_NAMES.harry);
		await table.getRow(1).getCell("Name").assertEqual(FULL_NAMES.ron);
		await table.getRow(2).getCell("Name").assertEqual(FULL_NAMES.dumbledore);
	});
});
