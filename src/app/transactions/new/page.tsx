import React from "react";
import type { Metadata } from "next";

import { TransactionForm } from "@/components/forms";
import { GroupSelectionGuard } from "@/components/layouts/guards/group-selection-guard";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "New Transaction"
};

export default async function NewTransactionPage() {
	const { id } = await getCurrentUser();

	return (
		<GroupSelectionGuard>
			<TransactionForm currentUserId={id} kind={{ type: "create" }} />
		</GroupSelectionGuard>
	);
}
