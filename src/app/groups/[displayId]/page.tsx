import React from "react";
import type { Metadata } from "next";

import { GroupForm } from "@/components/forms/group-form";

export const metadata: Metadata = {
	title: "Group Details"
};

namespace BillDetailsPage {
	export interface Props {
		params: Promise<{ displayId: string }>;
	}
}

export default async function BillDetailsPage(props: BillDetailsPage.Props) {
	const displayId = (await props.params).displayId;

	return <GroupForm displayId={displayId} />;
}
