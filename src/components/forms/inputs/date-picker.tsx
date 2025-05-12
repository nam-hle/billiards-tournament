"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Calendar } from "@/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/shadcn/form";

import { cn } from "@/utils/cn";
import { IssuedAtFieldTransformer } from "@/schemas/form.schema";

namespace DatePicker {
	export interface Props {
		readonly name: string;
		readonly label: string;
		readonly readonly?: boolean;
		readonly value: Date | undefined;
		readonly onChange: (date: Date | undefined) => void;
	}
}

export const DatePicker: React.FC<DatePicker.Props> = ({ label, value, readonly, onChange }) => (
	<FormItem className="flex flex-col">
		<FormLabel>{label}</FormLabel>
		<Popover>
			<PopoverTrigger asChild>
				<FormControl>
					<Button variant="outline" disabled={readonly} className={cn("w-full pl-3 text-left font-normal", !value && "text-muted-foreground")}>
						{value ? IssuedAtFieldTransformer.toDisplayString(value) : <span>Pick a date</span>}
						<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-0">
				<Calendar required initialFocus mode="single" selected={value} onSelect={onChange} disabled={(date) => date > new Date()} />
			</PopoverContent>
		</Popover>
		<FormMessage />
	</FormItem>
);
