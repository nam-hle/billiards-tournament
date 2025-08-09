import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import React, { use, Suspense } from "react";

import { Skeleton } from "@/components/shadcn/skeleton";
import { Table, TableRow, TableCell, TableHead, TableBody, TableHeader } from "@/components/shadcn/table";

import { cn } from "@/utils/cn";
import { type ClassName, type Container } from "@/types";

export namespace SuspendableTable {
	export interface Props<RowType, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> {
		readonly columns: ColumnType[];
		readonly data: Promise<RowType[]>;
		readonly expectedNumberOfRows?: number;

		readonly rowClassName?: string;
		readonly hrefGetter?: (params: { row: RowType }) => string;
		readonly dataKeyGetter: (params: { row: RowType }) => string;
		readonly isHighlighted?: (params: { row: RowType }) => boolean;
	}

	export interface BaseColumnType<RowType> {
		readonly label: string | React.ReactNode;
		readonly dataGetter: (params: { row: RowType; rowIndex: number }) => React.ReactNode;

		readonly key?: string;
		readonly width?: number;
		readonly className?: string;
		readonly alignment?: "left" | "center" | "right";
	}
}

export function SuspendableTable<RowType, ColumnType extends SuspendableTable.BaseColumnType<RowType> = SuspendableTable.BaseColumnType<RowType>>(
	props: SuspendableTable.Props<RowType, ColumnType>
) {
	const { columns } = props;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					{columns.map((column) => {
						return (
							<TableHead
								key={typeof column.label === "string" ? column.label : column.key}
								className={cn(
									column.alignment ? `text-${column.alignment}` : "text-center",
									column.className,
									column.width ? `w-[${column.width}px]` : undefined
								)}>
								{column.label}
							</TableHead>
						);
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				<Suspense fallback={<SkeletonTableBody numberOfCols={columns.length} numberOfRows={props.expectedNumberOfRows} />}>
					<SuspendableTableBody {...props} />
				</Suspense>
			</TableBody>
		</Table>
	);
}

function SuspendableTableBody<RowType, ColumnType extends SuspendableTable.BaseColumnType<RowType> = SuspendableTable.BaseColumnType<RowType>>(
	props: SuspendableTable.Props<RowType, ColumnType>
) {
	const { columns, rowClassName } = props;
	const data = use(props.data);

	return (
		<>
			{data.map((row, rowIndex) => {
				const key = props.dataKeyGetter({ row });
				const href = props.hrefGetter?.({ row });
				const isHighlighted = props.isHighlighted?.({ row });

				return (
					<LinkedTableRow key={key} href={href} className={cn(rowClassName, clsx({ "bg-secondary/95 transition-colors": isHighlighted }))}>
						{columns.map((column) => {
							return (
								<TableCell
									key={typeof column.label === "string" ? column.label : column.key}
									className={cn(column.alignment ? `text-${column.alignment}` : "text-center", column.className)}>
									{column.dataGetter({ row, rowIndex })}
								</TableCell>
							);
						})}
					</LinkedTableRow>
				);
			})}
		</>
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
	const router = useRouter();

	if (href === undefined) {
		return <ForwardedTableRow {...props} />;
	}

	return <ForwardedTableRow {...props} onClick={() => router.push(href as any)} className={cn(props.className, "cursor-pointer")} />;
};

namespace TableBodySkeleton {
	export interface Props {
		numberOfCols: number;
		numberOfRows?: number;
	}
}

const SkeletonTableBody: React.FC<TableBodySkeleton.Props> = (props) => {
	const { numberOfCols, numberOfRows = 5 } = props;

	return (
		<>
			{Array.from({ length: numberOfRows }).map((_, rowIndex) => {
				return (
					<TableRow key={rowIndex}>
						{Array.from({ length: numberOfCols }).map((_, colIndex) => {
							return (
								<TableCell key={colIndex}>
									<Skeleton className="h-8 w-full" />
								</TableCell>
							);
						})}
					</TableRow>
				);
			})}
		</>
	);
};
