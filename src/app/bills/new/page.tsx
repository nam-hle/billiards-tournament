import React from "react";
import type { Metadata } from "next";

import { BillForm } from "@/components/forms/bill-form";
import { GroupSelectionGuard } from "@/components/layouts/guards/group-selection-guard";

export const metadata: Metadata = {
	title: "New Bill"
};

export default async function NewBillPage() {
	return (
		<GroupSelectionGuard>
			<BillForm kind={{ type: "create" }} />
		</GroupSelectionGuard>
	);
}
