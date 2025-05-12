import { expect, type Page } from "@playwright/test";

import { test } from "@/test/setup";
import { Assertions } from "@/test/helpers/assertions";
import { type BillMember, DEFAULT_PASSWORD } from "@/test/utils";

export namespace Actions {
	export async function goToSignUpPage(page: Page) {
		await test.step(`Go to Sign up page`, async () => {
			await page.goto("/signup");
		});
	}

	export async function goToHomePage(page: Page) {
		await test.step(`Go to Home page`, async () => {
			await page.goto("/");
		});
	}

	export async function goToDashboardPage(page: Page) {
		await test.step(`Go to Dashboard page`, async () => {
			await page.goto("/dashboard");
		});
	}

	export async function goToGroupsPage(page: Page) {
		await test.step(`Go to Groups page`, async () => {
			await page.goto("/groups");
		});
	}

	export async function goToNotificationsPage(page: Page) {
		await test.step(`Go to Notifications page`, async () => {
			await page.goto("/notifications");
		});
	}

	export async function goToTransactionsPage(page: Page) {
		await test.step(`Go to Transactions page`, async () => {
			await page.getByRole("link", { name: "Transactions" }).click();
		});
	}

	export async function goToBillsPage(page: Page) {
		await test.step(`Go to Bills page`, async () => {
			await page.getByRole("link", { name: "Bills" }).click();
		});
	}

	export async function login(page: Page, emailName: string) {
		await test.step(`Login as ${emailName}`, async () => {
			await page.goto("/login");

			await fillInput(page, "email", `${emailName}@example.com`);
			await fillInput(page, "password", DEFAULT_PASSWORD);

			await submit(page);
			await expect(page).toHaveURL("/dashboard");
		});
	}

	export async function logout(page: Page, options?: { viaCookie?: boolean }) {
		await test.step(`Logout`, async () => {
			if (options?.viaCookie) {
				await page.context().clearCookies();
				await page.reload();
			} else {
				await page.locator(`[data-testid="navigation-item-profile"]`).click();
				await page.getByRole("menuitem", { name: "Log out" }).click();
			}

			await expect(page).toHaveURL("/login");
		});
	}

	export async function selectOption(page: Page, label: string, option: string, optionsList?: string[]) {
		await test.step(`Select ${option} in ${label}`, async () => {
			await page.getByRole("combobox", { name: label }).click();

			if (optionsList) {
				await expect(page.getByRole("option")).toHaveCount(optionsList.length);

				for (const option of optionsList) {
					await expect(page.getByRole("option", { name: option })).toBeVisible();
				}
			}

			await page.getByRole("option", { name: option }).click();
		});
	}

	export async function selectBillMember(page: Page, testId: "creditor" | `debtors.${number}`, value: string) {
		await test.step(`Select ${value} in ${testId}`, async () => {
			await page.getByTestId(testId).getByRole("combobox").click();

			await page.getByRole("option", { name: value }).click();
		});
	}

	export async function fillInput(page: Page, name: string, value: string) {
		await test.step(`Fill ${name} with ${value}`, async () => {
			await page.fill(`input[name="${name}"]`, value);
		});
	}

	export async function submit(page: Page) {
		await test.step("Submit", async () => {
			await page.locator(`button[type="submit"]`).click();
		});
	}

	export namespace SignUpForm {
		export async function submit(page: Page) {
			await test.step("Submit", async () => {
				await page.locator(`button[type="submit"]`).click();
			});
		}

		export async function fillDisplayName(page: Page, name: string) {
			await test.step(`Fill display name with ${name}`, async () => {
				await Actions.fillInput(page, "fullName", name);
			});
		}

		export async function fillEmail(page: Page, email: string) {
			await test.step(`Fill email with ${email}`, async () => {
				await Actions.fillInput(page, "email", email);
			});
		}

		export async function fillPassword(page: Page, password: string) {
			await test.step(`Fill password with ${password}`, async () => {
				await Actions.fillInput(page, "password", password);
			});
		}

		export async function fillConfirmPassword(page: Page, confirmPassword: string) {
			await test.step(`Fill confirm password with ${confirmPassword}`, async () => {
				await Actions.fillInput(page, "confirmPassword", confirmPassword);
			});
		}
	}

	export namespace LoginForm {
		export async function submit(page: Page) {
			await test.step("Submit", async () => {
				await page.locator(`button[type="submit"]`).click();
			});
		}

		export async function fillEmail(page: Page, email: string) {
			await test.step(`Fill email with ${email}`, async () => {
				await Actions.fillInput(page, "email", email);
			});
		}

		export async function fillPassword(page: Page, password: string) {
			await test.step(`Fill password with ${password}`, async () => {
				await Actions.fillInput(page, "password", password);
			});
		}
	}

	export namespace TransactionForm {
		export async function submit(page: Page) {
			await test.step("Submit transaction", async () => {
				await page.getByRole("main").getByRole("button", { name: "Create" }).click();
			});
		}

		export async function next(page: Page) {
			await test.step("Go to QR screen", async () => {
				await page.getByRole("main").getByRole("button", { name: "Next" }).click();
			});
		}

		export async function selectReceiver(page: Page, receiver: string, candidateReceivers?: string[]) {
			await selectOption(page, "Receiver", receiver, candidateReceivers);
		}

		export async function selectAccount(page: Page, account: string, candidateAccounts?: string[]) {
			await selectOption(page, "Bank Account", account, candidateAccounts);
		}

		export async function fillAmount(page: Page, amount: string) {
			await fillInput(page, "amount", amount);
		}

		export async function fill(page: Page, params: { amount: string; account: string; receiver: string; candidateReceivers?: string[] }) {
			await test.step(`Fill transaction form: receiver=${params.receiver}, amount= ${params.amount}`, async () => {
				await expect(page).toHaveURL("/transactions");

				await page.getByRole("link", { name: "New" }).click();
				await expect(page.getByRole("main").getByText("New Transaction", { exact: true })).toBeVisible();

				await selectReceiver(page, params.receiver, params.candidateReceivers);
				await selectAccount(page, params.account);
				await fillAmount(page, params.amount);
				await next(page);

				await expect(page.getByTestId("transaction-qr")).toBeVisible();
				await submit(page);

				await Assertions.assertToast(page, "Transaction created successfully");
				await expect(page).toHaveURL("/transactions");
			});
		}
	}

	export namespace BillForm {
		export async function edit(page: Page) {
			await test.step(`Edit bill`, async () => {
				await page.getByRole("button", { name: "Edit" }).click();
			});
		}

		export async function save(page: Page) {
			await test.step("Save bill", async () => {
				await page.getByRole("button", { name: "Done" }).click();
			});
		}

		export async function cancel(page: Page) {
			await test.step("Cancel changes", async () => {
				await page.getByRole("button", { name: "Cancel" }).click();
			});
		}

		export async function addDebtor(page: Page) {
			await test.step(`Add debtor`, async () => {
				await page.getByRole("button", { name: "Add debtor" }).click();
			});
		}

		export async function removeDebtor(page: Page, debtorIndex: number) {
			await test.step(`Remove debtor`, async () => {
				await page.getByTestId(`remove-debtors.${debtorIndex}`).click();
			});
		}

		export async function fillDescription(page: Page, value: string) {
			await fillInput(page, "description", value);
		}

		export async function selectCreditor(page: Page, name: string) {
			await selectBillMember(page, "creditor", name);
		}

		export async function fillCreditorAmount(page: Page, amount: string) {
			await fillInput(page, "creditor.amount", amount);
		}

		export async function selectDebtor(page: Page, debtorIndex: number, name: string) {
			await selectBillMember(page, `debtors.${debtorIndex}`, name);
		}

		export async function fillDebtorAmount(page: Page, debtorIndex: number, amount: string) {
			await fillInput(page, `debtors.${debtorIndex}.amount`, amount);
		}

		export interface FillParams {
			description: string;
			creditor: BillMember;
			debtors: BillMember[];
		}
		export async function fill(page: Page, params: { description: string; creditor: BillMember; debtors: BillMember[] }) {
			await test.step(`Fill bill form`, async () => {
				await expect(page).toHaveURL("/bills");

				// TODO: Move click outside this function
				await page.getByRole("link", { name: "New" }).click();

				await fillDescription(page, params.description);
				await selectCreditor(page, params.creditor.name);
				await fillCreditorAmount(page, params.creditor.amount);

				for (let debtorIndex = 0; debtorIndex < params.debtors.length; debtorIndex++) {
					if (debtorIndex > 0) {
						await addDebtor(page);
					}

					const debtor = params.debtors[debtorIndex];
					await selectDebtor(page, debtorIndex, debtor.name);
					await fillDebtorAmount(page, debtorIndex, debtor.amount);
				}
			});
		}
	}
}
