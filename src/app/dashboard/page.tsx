import React from "react";

import { BillCardsList } from "@/components/cards/bill-cards-list";
import { FinancialSummary } from "@/components/cards/financial-summary";
import { TransactionCardList } from "@/components/cards/transaction-cards-list";
import { GroupSelectionGuard } from "@/components/layouts/guards/group-selection-guard";

import { getCurrentUser } from "@/services/supabase/server";

export default async function DashboardPage() {
	const { id } = await getCurrentUser();

	return (
		<GroupSelectionGuard>
			<div className="grid grid-cols-6 gap-4">
				<FinancialSummary />
				<BillCardsList currentUserId={id} />
				<TransactionCardList currentUserId={id} />
			</div>
		</GroupSelectionGuard>
	);
}
