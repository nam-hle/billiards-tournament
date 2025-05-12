import React from "react";
import NextLink from "next/link";

import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { Heading } from "@/components/mics/heading";
import { Message } from "@/components/mics/message";
import { TableBodySkeleton } from "@/components/tables/data-table/table-body-skeleton";
import { DataTablePagination } from "@/components/tables/data-table/data-table-pagination";

import { cn } from "@/utils/cn";
import { type Linkable, type ClassName, type Container, type Identifiable } from "@/types";

export namespace DataTable {
	export interface Props<RowType extends Identifiable & Linkable, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> {
		title: string;
		rowHeight?: number;
		filtering?: boolean;
		hideHeading?: boolean;
		columns: ColumnType[];
		action?: React.ReactNode;
		toolbar?: React.ReactNode;
		data: RowType[] | undefined;
		pagination?: DataTablePagination.Props;
	}

	export interface BaseColumnType<RowType extends Identifiable> {
		readonly key: string;
		readonly label: string;
		readonly alignment?: "left" | "center" | "right";
		readonly dataGetter: (params: { row: RowType }) => React.ReactNode;
		readonly titleGetter?: (params: { row: RowType }) => string | undefined;
	}
}

export function DataTable<
	RowType extends Identifiable & Linkable,
	ColumnType extends DataTable.BaseColumnType<RowType> = DataTable.BaseColumnType<RowType>
>(props: DataTable.Props<RowType, ColumnType>) {
	const { data, title, action, columns, toolbar, filtering, pagination, hideHeading } = props;

	return (
		<div className="w-full space-y-4" data-testid="table-container">
			{!hideHeading && (
				<div className="flex w-full flex-row items-center justify-between">
					<Heading data-testid="table-heading">{title + (pagination?.fullSize !== undefined ? ` (${pagination.fullSize})` : "")}</Heading>
					{action}
				</div>
			)}
			{toolbar && (
				<div data-testid="table-toolbar" className="flex flex-1 items-center space-x-2">
					{toolbar}
				</div>
			)}
			<div className="rounded-md border">
				<Table data-testid={`table__${data === undefined ? "loading" : "settled"}`}>
					<TableHeader>
						<TableRow className={`h-${props.rowHeight ?? 16}`}>
							{columns.map((column) => {
								return (
									<TableHead key={column.key} className={`text-${column.alignment ?? "left"}`}>
										{column.label}
									</TableHead>
								);
							})}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data === undefined ? (
							<TableBodySkeleton numberOfRows={5} numberOfCols={columns.length} />
						) : data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={columns.length}>
									<Message title={filtering ? `No matched ${title.toLowerCase()} found` : `You have no ${title.toLowerCase()} yet`} />
								</TableCell>
							</TableRow>
						) : (
							data.map((row) => (
								<LinkedTableRow key={row.id} href={row.href} className={`h-${props.rowHeight ?? 16}`}>
									{columns.map((column) => {
										return (
											<TableCell key={column.key} title={column.titleGetter?.({ row })} className={`p-2 text-${column.alignment ?? "left"}`}>
												{column.dataGetter({ row })}
											</TableCell>
										);
									})}
								</LinkedTableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination {...props.pagination} />
		</div>
	);
}

const ForwardedTableRow = React.forwardRef<HTMLTableRowElement, Container & React.HTMLAttributes<HTMLTableRowElement>>(
	function ForwardedRow(props, ref) {
		const { children, ...rest } = props;

		return (
			<TableRow ref={ref} {...rest}>
				{children}
			</TableRow>
		);
	}
);

const LinkedTableRow: React.FC<{ href?: string } & ClassName & Container & React.HTMLAttributes<HTMLTableRowElement>> = ({ href, ...props }) => {
	if (href === undefined) {
		return <ForwardedTableRow {...props} />;
	}

	return (
		<NextLink passHref prefetch href={href} legacyBehavior>
			<ForwardedTableRow {...props} className={cn(props.className, "cursor-pointer")} />
		</NextLink>
	);
};
