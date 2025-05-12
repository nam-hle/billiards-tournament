import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { Actions } from "@/test/helpers/actions";
import { Assertions } from "@/test/helpers/assertions";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

test.describe("basic", () => {
	const testCases: {
		description: string;
		formParams: Actions.BillForm.FillParams;
		statsExpectation: Assertions.StatsExpectation;
		expectedRecentTable: Assertions.BillsTableExpectation;
	}[] = [
		{
			statsExpectation: {},
			description: "As creator only",
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.ron },
				debtors: [
					{ amount: "20", name: FULL_NAMES.ron },
					{ amount: "30", name: FULL_NAMES.hermione },
					{ amount: "40", name: FULL_NAMES.dumbledore }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: {
							amount: "90.000",
							name: `${FULL_NAMES.ron}`
						},
						debtors: [
							{
								amount: "30.000",
								name: `${FULL_NAMES.hermione}`
							},
							{
								amount: "40.000",
								name: `${FULL_NAMES.dumbledore}`
							},
							{
								amount: "20.000",
								name: `${FULL_NAMES.ron}`
							}
						]
					}
				]
			}
		},
		{
			description: "As creditor only",
			statsExpectation: { Paid: "90.000", "Net Balance": "90.000" },
			formParams: {
				description: "Dinner",
				creditor: { amount: "90000", name: FULL_NAMES.harry },
				debtors: [
					{ amount: "20000", name: FULL_NAMES.ron },
					{ amount: "30000", name: FULL_NAMES.hermione },
					{ amount: "40000", name: FULL_NAMES.dumbledore }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: { amount: "90.000", name: FULL_NAMES.harry },
						debtors: [
							{ amount: "20.000", name: FULL_NAMES.ron },
							{ amount: "30.000", name: FULL_NAMES.hermione },
							{ amount: "40.000", name: FULL_NAMES.dumbledore }
						]
					}
				]
			}
		},
		{
			description: "As debtor only",
			statsExpectation: { Owed: "20.000", "Net Balance": "-20.000" },
			formParams: {
				description: "Dinner",
				creditor: { amount: "100000", name: FULL_NAMES.ron },
				debtors: [
					{ amount: "20000", name: FULL_NAMES.harry },
					{ amount: "35000", name: FULL_NAMES.hermione },
					{ amount: "45000", name: FULL_NAMES.dumbledore }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: { amount: "100.000", name: FULL_NAMES.ron },
						debtors: [
							{ amount: "20.000", name: FULL_NAMES.harry },
							{ amount: "35.000", name: FULL_NAMES.hermione },
							{ amount: "45.000", name: FULL_NAMES.dumbledore }
						]
					}
				]
			}
		},
		{
			description: "As creditor and debtor",
			statsExpectation: { Paid: "60.000", "Net Balance": "60.000" },
			formParams: {
				description: "Dinner",
				creditor: { amount: "90000", name: FULL_NAMES.harry },
				debtors: [
					{ amount: "20000", name: FULL_NAMES.ron },
					{ amount: "30000", name: FULL_NAMES.harry },
					{ amount: "40000", name: FULL_NAMES.dumbledore }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: { amount: "90.000", name: FULL_NAMES.harry },
						debtors: [
							{ amount: "20.000", name: FULL_NAMES.ron },
							{ amount: "30.000", name: FULL_NAMES.harry },
							{ amount: "40.000", name: FULL_NAMES.dumbledore }
						]
					}
				]
			}
		}
	];

	for (const testCase of testCases) {
		test(testCase.description, async ({ page }) => {
			await seedBasicPreset();

			await Actions.login(page, "harry");

			await Actions.goToBillsPage(page);
			await Actions.BillForm.fill(page, testCase.formParams);
			await Actions.submit(page);

			await expect(page).toHaveURL("/bills");

			await Actions.goToDashboardPage(page);

			await Assertions.assertBillsCardList(page, testCase.expectedRecentTable);
			await Assertions.assertStats(page, testCase.statsExpectation);
		});
	}
});
