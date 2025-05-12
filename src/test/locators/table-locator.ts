import { expect, type Page, type Locator } from "@playwright/test";

export class TableLocator {
	private readonly table: Locator;
	private readonly tableContainer: Locator;
	private headerCells: string[];

	constructor(
		public page: Page,
		private tableIndex: number = 0
	) {
		this.tableContainer = page.getByTestId("table-container").nth(tableIndex);
		this.table = this.tableContainer.locator("table");
		this.headerCells = [];
	}

	async waitForLoading() {
		await this.tableContainer.getByTestId("table__settled").waitFor({ state: "visible" });
	}

	async init() {
		await this.waitForLoading();
		this.headerCells = await this.table.locator("thead tr th").allInnerTexts();

		return this;
	}

	getContainer() {
		return this.tableContainer;
	}

	getHeading() {
		return this.page.getByRole("heading").nth(this.tableIndex);
	}

	getRow(rowIndex: number): Row {
		return new Row(this.table, rowIndex, this.headerCells);
	}

	get nextPageButton() {
		return this.tableContainer.getByRole("button", { name: "Go to next page" });
	}
}

export class Row {
	private readonly row: Locator;
	private headerCells: string[];

	constructor(
		private table: Locator,
		rowIndex: number,
		headerCells: string[]
	) {
		this.row = this.table.locator(`tbody tr:nth-of-type(${rowIndex + 1})`);
		this.headerCells = headerCells;
	}

	getCell(columnLabel: string | number): Cell {
		if (typeof columnLabel === "number") {
			return new Cell(this.row, columnLabel);
		}

		const columnIndex = this.headerCells.indexOf(columnLabel);

		if (columnIndex === -1) {
			throw new Error(`Column '${columnLabel}' not found`);
		}

		return new Cell(this.row, columnIndex);
	}

	async click() {
		await this.row.click();
	}
}

export class Cell {
	private readonly cell: Locator;

	constructor(
		private row: Locator,
		columnIndex: number
	) {
		this.cell = this.row.locator(`td:nth-of-type(${columnIndex + 1})`);
	}

	get locator(): Locator {
		return this.cell;
	}

	async assertEqual(expected: string | RegExp) {
		const actualText = (await this.cell.innerText()).trim();
		expect(actualText).toMatch(expected);
	}
}
