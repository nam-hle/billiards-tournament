import React from "react";
import type { Metadata } from "next";
import { TRPCError } from "@trpc/server";

import { BillForm } from "@/components/forms/bill-form";
import { NotFoundMessage } from "@/components/layouts/messages/not-found-message";
import { ForbiddenMessage } from "@/components/layouts/messages/forbidden-message";
import { CorrectGroupGuard } from "@/components/layouts/guards/correct-group-guard";

import { createCaller } from "@/services/trpc/caller";

export const metadata: Metadata = {
	title: "Bill Details"
};

namespace BillDetailsPage {
	export interface Props {
		params: Promise<{ id: string }>;
	}
}

export default async function BillDetailsPage(props: BillDetailsPage.Props) {
	const displayId = (await props.params).id;

	try {
		const caller = await createCaller();
		const bill = await caller.bills.get({ displayId });

		return (
			<CorrectGroupGuard expectedGroup={bill.group}>
				<BillForm kind={{ bill, type: "update" }} />
			</CorrectGroupGuard>
		);
	} catch (error) {
		if (error instanceof TRPCError) {
			if (error.code === "NOT_FOUND") {
				return <NotFoundMessage />;
			}

			if (error.code === "FORBIDDEN") {
				return <ForbiddenMessage />;
			}
		}

		throw error;
	}
}
