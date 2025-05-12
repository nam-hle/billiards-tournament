"use client";

import React from "react";

import * as ShadCN from "@/components/shadcn/select";
import { FormControl, FormMessage } from "@/components/shadcn/form";

namespace Select {
	export interface Props {
		readonly name?: string;
		readonly disabled?: boolean;
		readonly value: string | undefined;
		readonly emptyPlaceholder?: string;
		readonly onValueChange: (value: string) => void;
		readonly items: { value: string; label: string }[];
	}
}

export const Select: React.FC<Select.Props> = (props) => {
	const { items, emptyPlaceholder, ...rest } = props;

	return (
		<>
			<ShadCN.Select {...rest}>
				<FormControl>
					<ShadCN.SelectTrigger className="h-9 w-full">
						<ShadCN.SelectValue placeholder={(items.length === 0 && emptyPlaceholder) || "Select one"} />
					</ShadCN.SelectTrigger>
				</FormControl>
				<ShadCN.SelectContent>
					{props.items.map(({ value, label }) => (
						<ShadCN.SelectItem key={value} value={value}>
							{label}
						</ShadCN.SelectItem>
					))}
				</ShadCN.SelectContent>
			</ShadCN.Select>
			<FormMessage />
		</>
	);
};
