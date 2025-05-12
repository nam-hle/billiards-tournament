import { NumericFormat } from "react-number-format";
import React, { type ChangeEventHandler } from "react";

import { Input } from "@/components/shadcn/input";

namespace AmountInput {
	export interface Props {
		name: string;
		value: string;
		disabled?: boolean;
		onChange: ChangeEventHandler<HTMLInputElement>;
	}
}

export const AmountInput: React.FC<AmountInput.Props> = (props) => {
	return <NumericFormat suffix=" ₫" thousandSeparator customInput={Input} {...props} />;
};
