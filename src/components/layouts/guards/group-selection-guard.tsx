import React from "react";

import { Message } from "@/components/mics/message"; // Assume this hook manages group selection

import { type Container } from "@/types";
import { getCurrentUser } from "@/services/supabase/server";

export const GroupSelectionGuard = async ({ children }: Container) => {
	const { group } = await getCurrentUser();

	if (!group) {
		return <Message title="Group Selection Required" description="A group must be chosen to continue with this page" />;
	}

	return <>{children}</>;
};
