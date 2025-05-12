"use client";

import React from "react";

import { DataTable } from "@/components/tables/data-table";
import { RequestDialog } from "@/components/dialogs/request-dialog";

import { trpc } from "@/services";

export const RequestsTable = () => {
	const { data } = trpc.user.requests.useQuery();

	return (
		<DataTable
			title="Requests"
			action={<RequestDialog />}
			pagination={{ fullSize: data?.length }}
			data={data?.map((row) => ({ ...row }))}
			columns={[
				{ key: "id", label: "Group ID", dataGetter: ({ row }) => row.displayId },
				{ key: "name", label: "Group Name", dataGetter: ({ row }) => row.name }
			]}
		/>
	);
};
