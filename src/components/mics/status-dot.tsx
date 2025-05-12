import React from "react";

import { cn } from "@/utils/cn";
const statusVariants = {
	info: "bg-blue-500",
	error: "bg-red-500",
	default: "bg-gray-400",
	success: "bg-green-500",
	warning: "bg-yellow-500"
};

export const StatusDot = ({ value }: { value: "info" | "success" | "warning" | "error" }) => (
	<span className={cn("inline-block h-2 w-2 rounded-full", statusVariants[value] || statusVariants.default)} />
);
