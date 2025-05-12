import React from "react";
import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/shadcn/button";

namespace LoadingButton {
	export interface Props extends ButtonProps {
		readonly loading?: boolean;
		readonly loadingText?: string;
	}
}
export const LoadingButton: React.FC<LoadingButton.Props> = (props) => {
	const { loading, children, loadingText, ...rest } = props;

	return (
		<Button {...rest} disabled={props.disabled || loading}>
			{loading && <Loader2 className="animate-spin" />}
			{loading ? loadingText : children}
		</Button>
	);
};
