import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex min-h-[400px] flex-row items-center justify-center space-x-2">
			<Loader2 className="h-5 w-5 animate-[spin_2s_linear_infinite] text-muted-foreground" />
			<p className="text-md text-muted-foreground">Loading...</p>
		</div>
	);
}
