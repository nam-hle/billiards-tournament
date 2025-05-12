"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

import { Button, type ButtonProps } from "@/components/shadcn/button";

namespace CopyButton {
	export interface Props extends ButtonProps {
		value: string;
		displayValue?: string;
		onCopied?: () => void;
	}
}

export const CopyButton = ({ value, onCopied, displayValue, size = "icon", className = "", variant = "ghost" }: CopyButton.Props) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(value);
		setCopied(true);
		onCopied?.();

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<Button
			size={size}
			variant={variant}
			onClick={handleCopy}
			title={`Copy ${displayValue || value}`}
			className={`${size === "icon" ? "h-6 w-6" : ""} ${className}`}>
			{copied ? (
				<>
					<Check className="h-3 w-3" />
					{size !== "icon" && <span className="ml-2">Copied!</span>}
				</>
			) : (
				<>
					<Copy className="h-3 w-3" />
					{size !== "icon" && <span className="ml-2">Copy</span>}
				</>
			)}
		</Button>
	);
};
