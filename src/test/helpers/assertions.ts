import { expect, type Page } from "@playwright/test";

import { VND } from "@/test/utils";
import { test } from "@/test/setup";
import { Locators } from "@/test/helpers/locators";
import { type TableLocator } from "@/test/locators/table-locator";

export namespace Assertions {
	const StateLabels = ["Owed", "Received", "Paid", "Sent", "Net Balance"] as const;
	export type StatsExpectation = Partial<Record<(typeof StateLabels)[number], string>>;

	export async function assertToast(page: Page, message: string) {
		await expect(page.getByText(message, { exact: true })).toBeVisible();
	}

	export async function assertNoToast(page: Page, message: string) {
		await expect(page.getByText(message, { exact: true })).not.toBeVisible();
	}

	export async function assertStats(page: Page, expected: Partial<Record<(typeof StateLabels)[number], string>>) {
		await test.step("Assert Stats", async () => {
			for (const label of StateLabels) {
				await expect(Locators.locateStatValue(page, label)).toHaveText(`${expected[label] ?? "0"} ${VND}`);
			}
		});
	}

	export async function assertNotificationsTable(page: Page, params: { messages: string[] }) {
		await test.step("Assert Notifications Table", async () => {
			const messages = page.getByTestId("table").getByTestId("notification-text");

			await expect(messages).toHaveCount(params.messages.length);

			for (let i = 0; i < params.messages.length; i++) {
				await expect(messages.nth(i)).toHaveText(params.messages[i]);
			}
		});
	}

	export async function assertTransactionsTable(
		table: TableLocator,
		params: {
			heading?: string;
			pagination?: null | { totalPages: number; currentPage: number };
			rows: { sender: string; amount: string; status: string; receiver: string; issuedAt?: string }[];
		}
	) {
		await table.waitForLoading();

		await test.step("Assert Transactions Table", async () => {
			if (params.heading) {
				await expect(table.getHeading()).toHaveText(params.heading);
			}

			if (params.pagination !== undefined) {
				const pagination = table.getContainer().getByTestId("table-pagination");

				if (params.pagination === null) {
					await expect(pagination).not.toBeVisible();
				} else {
					await expect(pagination).toBeVisible();
					await expect(pagination.getByTestId("table-pagination-label")).toHaveText(
						`Page ${params.pagination.currentPage} of ${params.pagination.totalPages}`
					);
				}
			}

			for (let rowIndex = 0; rowIndex < params.rows.length; rowIndex++) {
				await test.step(`Assert Transaction row index ${rowIndex}`, async () => {
					const row = params.rows[rowIndex];
					await table.getRow(rowIndex).getCell("Sender").assertEqual(row.sender);
					await table.getRow(rowIndex).getCell("Receiver").assertEqual(row.receiver);
					await table.getRow(rowIndex).getCell("Amount").assertEqual(row.amount);
					await table.getRow(rowIndex).getCell("Status").assertEqual(row.status);

					if (row.issuedAt !== undefined) {
						await table.getRow(rowIndex).getCell("Issued At").assertEqual(row.issuedAt);
					}
				});
			}
		});
	}

	export interface BillsTableExpectation {
		heading?: string;
		pagination: null | { totalPages: number; currentPage: number };
		rows: { description: string; creditor: { name: string; amount: string }; debtors: { name: string; amount: string }[] }[];
	}

	export async function assertBillsCardList(page: Page, params: BillsTableExpectation) {
		const cardList = page.locator(`[data-testid="card-list-container"]`, { hasText: "Recent Bills" });

		await expect(cardList).toBeVisible();

		await test.step("Assert Bill Cards", async () => {
			if (params.rows.length === 0) {
				await expect(cardList.getByTestId("card")).toHaveCount(0);
			} else {
				await expect(cardList.getByTestId("card")).toHaveCount(params.rows.length);

				for (let cardIndex = 0; cardIndex < params.rows.length; cardIndex++) {
					await test.step(`Assert bill card index ${cardIndex}`, async () => {
						const card = cardList.getByTestId("card").nth(cardIndex);

						const row = params.rows[cardIndex];
						await expect(card.getByTestId("bill-description")).toHaveText(row.description);
						await expect(card.getByTestId("bill-creditor").getByTestId("avatar-fallback")).toHaveAccessibleDescription(row.creditor.name);
						// await table.getRow(cardIndex).getCell("Creditor").assertEqual(row.creditor);

						// for (const debtor of row.debtors) {
						// 	await table.getRow(cardIndex).getCell("Debtors").assertContain(debtor);
						// }
					});
				}
			}
		});
	}

	export async function assertBillsTable(table: TableLocator, params: BillsTableExpectation) {
		await table.waitForLoading();

		await test.step("Assert Bills Table", async () => {
			if (params.heading) {
				await expect(table.getHeading()).toHaveText(params.heading);
			}

			if (params.pagination !== undefined) {
				const pagination = table.getContainer().getByTestId("table-pagination");

				if (params.pagination === null) {
					await expect(pagination).not.toBeVisible();
				} else {
					await expect(pagination).toBeVisible();
					await expect(pagination.getByTestId("table-pagination-label")).toHaveText(
						`Page ${params.pagination.currentPage} of ${params.pagination.totalPages}`
					);
				}
			}

			if (params.rows.length === 0) {
				await expect(table.getContainer().getByText("You have no bills yet")).toBeVisible();
			} else {
				for (let rowIndex = 0; rowIndex < params.rows.length; rowIndex++) {
					await test.step(`Assert bill row index ${rowIndex}`, async () => {
						const row = params.rows[rowIndex];
						await table.getRow(rowIndex).getCell("Description").assertEqual(row.description);
						await expect(table.getRow(rowIndex).getCell("Creditor").locator.getByTestId("avatar-fallback")).toHaveAccessibleDescription(
							row.creditor.name
						);

						const debtorsCellLocator = table.getRow(rowIndex).getCell("Debtors").locator;
						await expect(debtorsCellLocator.getByTestId("avatar-amount")).toHaveCount(row.debtors.length);

						for (let debtorIndex = 0; debtorIndex < row.debtors.length; debtorIndex++) {
							const debtor = row.debtors[debtorIndex];
							const avatarAmount = debtorsCellLocator.locator(`[data-testid="avatar-amount"]`, {
								has: table.page.locator(`[data-testid="avatar-fallback"][title="${debtor.name}"]`)
							});
							await expect(avatarAmount.getByTestId("amount")).toHaveText(`${debtor.amount} ${VND}`);
						}
					});
				}
			}
		});
	}
}
