import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { type Metadata } from "next";

import { Button } from "@/components/shadcn/button";

import { BillsTable } from "@/components/tables";
import { GroupSelectionGuard } from "@/components/layouts/guards/group-selection-guard";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Bills"
};

export default async function BillsPage() {
	const { id } = await getCurrentUser();

	return (
		<GroupSelectionGuard>
			<BillsTable
				currentUserId={id}
				action={
					<Button asChild size="sm">
						<Link href="/bills/new">
							<Plus /> New
						</Link>
					</Button>
				}
			/>
		</GroupSelectionGuard>
	);
}
