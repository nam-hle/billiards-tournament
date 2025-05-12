import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/shadcn/button";

import { DEFAULT_PAGE_SIZE } from "@/constants";

export namespace DataTablePagination {
	export interface Props {
		readonly fullSize?: number;
		readonly pageSize?: number;
		// 1-based
		readonly pageNumber?: number;
		readonly onPageChange?: (pageNumber: number) => void;
	}
}
export const DataTablePagination: React.FC<DataTablePagination.Props> = (props) => {
	const { fullSize, pageNumber, onPageChange, pageSize = DEFAULT_PAGE_SIZE } = props;

	if (fullSize === undefined || pageNumber === undefined || onPageChange === undefined) {
		return null;
	}

	const totalPage = Math.ceil(fullSize / pageSize);
	const hasPreviousPage = pageNumber > 1;
	const hasNextPage = pageNumber < totalPage;

	if (totalPage <= 1) {
		return null;
	}

	return (
		<div data-testid="table-pagination" className="flex items-center justify-end space-x-6 lg:space-x-8">
			<div data-testid="table-pagination-label" className="flex w-[100px] items-center justify-center text-sm font-medium">
				Page {pageNumber} of {totalPage}
			</div>
			<div className="flex items-center space-x-2">
				<Button variant="outline" disabled={!hasPreviousPage} onClick={() => onPageChange(1)} className="h-8 w-8 p-0 lg:flex">
					<span className="sr-only">Go to first page</span>
					<ChevronsLeft />
				</Button>
				<Button variant="outline" className="h-8 w-8 p-0" disabled={!hasPreviousPage} onClick={() => onPageChange(pageNumber - 1)}>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeft />
				</Button>
				<Button variant="outline" className="h-8 w-8 p-0" disabled={!hasNextPage} onClick={() => onPageChange(pageNumber + 1)}>
					<span className="sr-only">Go to next page</span>
					<ChevronRight />
				</Button>
				<Button variant="outline" disabled={!hasNextPage} className="h-8 w-8 p-0 lg:flex" onClick={() => onPageChange(totalPage)}>
					<span className="sr-only">Go to last page</span>
					<ChevronsRight />
				</Button>
			</div>
		</div>
	);
};
