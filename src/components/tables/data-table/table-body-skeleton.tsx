import React from "react";

import { Skeleton } from "@/components/shadcn/skeleton";
import { TableRow, TableCell } from "@/components/shadcn/table";

namespace TableBodySkeleton {
	export interface Props {
		numberOfCols: number;
		numberOfRows?: number;
	}
}

export const TableBodySkeleton: React.FC<TableBodySkeleton.Props> = (props) => {
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
