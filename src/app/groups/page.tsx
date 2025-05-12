import React from "react";
import type { Metadata } from "next";

import { GroupsTable } from "@/components/tables/groups-table";
import { InvitesTable } from "@/components/tables/invites-table";
import { RequestsTable } from "@/components/tables/requests-table";

export const metadata: Metadata = {
	title: "Groups"
};

export default async function GroupsPage() {
	return (
		<div className="flex flex-col gap-6">
			<GroupsTable />
			<RequestsTable />
			<InvitesTable />
		</div>
	);
}
