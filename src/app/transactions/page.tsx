import React from "react";
import { type Metadata } from "next";

import { TransactionsTable } from "@/components/tables";
import { GroupSelectionGuard } from "@/components/layouts/guards/group-selection-guard";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Transactions"
};

export default async function TransactionsPage() {
	const { id } = await getCurrentUser();

	return (
		<GroupSelectionGuard>
			<TransactionsTable currentUserId={id} />
		</GroupSelectionGuard>
	);
}
