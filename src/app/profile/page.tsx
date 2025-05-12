import React from "react";
import type { Metadata } from "next";

import { ProfileForm } from "@/components/forms";
import { BankAccountsTable } from "@/components/tables";

import { getCurrentUser } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Profile"
};

export default async function ProfilePage() {
	const currentUser = await getCurrentUser();

	return (
		<>
			<ProfileForm />
			<BankAccountsTable currentUserId={currentUser.id} />
		</>
	);
}
