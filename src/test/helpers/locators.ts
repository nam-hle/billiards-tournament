import { type Page } from "@playwright/test";

import { TableLocator } from "@/test/locators/table-locator";

export namespace Locators {
	export function locateErrors(page: Page) {
		return page.locator('[data-testid^="form-error"]');
	}

	export function locateError(page: Page, fieldName: string) {
		return page.getByTestId(`form-error-${fieldName}`);
	}

	export function locateNotifications(page: Page) {
		return page.getByTestId("table").getByTestId("notification-text");
	}

	export function locateStatValue(page: Page, statLabel: string) {
		return page.locator(`[data-testid="card"]`).filter({ hasText: statLabel }).getByTestId("card-content");
	}

	export async function locateTable(page: Page, tableIndex: number = 0) {
		const table = new TableLocator(page, tableIndex);
		await table.init();

		return table;
	}
}
