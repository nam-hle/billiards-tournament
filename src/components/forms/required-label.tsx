import React from "react";

import { FormLabel } from "@/components/shadcn/form";

import { type Container } from "@/types";

export const RequiredLabel = ({ children }: Container) => (
	<FormLabel>
		{children} <span className="text-red-500">*</span>
	</FormLabel>
);
