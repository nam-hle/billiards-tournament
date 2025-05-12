"use client";

import React from "react";

import { DataTable } from "@/components/tables/data-table";
import { AvatarGroup } from "@/components/avatars/avatar-group";
import { NewGroupDialog } from "@/components/forms/new-group-form";

import { trpc } from "@/services";

export const GroupsTable = () => {
	const { data } = trpc.groups.groups.useQuery();

	return (
		<DataTable
			title="Groups"
			action={<NewGroupDialog />}
			pagination={{ fullSize: data?.length }}
			data={data?.map((row) => ({ ...row, href: `/groups/${row.displayId}` }))}
			columns={[
				{ key: "id", label: "Group ID", dataGetter: ({ row }) => row.displayId },
				{ key: "name", label: "Group Name", dataGetter: ({ row }) => row.name },
				{
					key: "members",
					label: "Members",
					dataGetter: ({ row }) => <AvatarGroup users={row.members} />
				}
			]}
		/>
	);
};
