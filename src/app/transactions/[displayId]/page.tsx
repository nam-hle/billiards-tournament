import React from "react";
import type { Metadata } from "next";
import { TRPCError } from "@trpc/server";

import { TransactionForm } from "@/components/forms";
import { NotFoundMessage } from "@/components/layouts/messages/not-found-message";
import { ForbiddenMessage } from "@/components/layouts/messages/forbidden-message";
import { CorrectGroupGuard } from "@/components/layouts/guards/correct-group-guard";

import { createCaller } from "@/services/trpc/caller";
import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Transaction Details"
};

namespace TransactionDetailsPage {
	export interface Props {
		params: Promise<{ displayId: string }>;
	}
}

export default async function TransactionDetailsPage(props: TransactionDetailsPage.Props) {
	const displayId = (await props.params).displayId;
	const { id } = await getCurrentUser();

	if (displayId === "installHook.js.map") {
		return null;
	}

	try {
		const caller = await createCaller();
		const transaction = await caller.transactions.get({ displayId });

		return (
			<CorrectGroupGuard expectedGroup={transaction.group}>
				<TransactionForm currentUserId={id} kind={{ transaction, type: "update" }} />
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
