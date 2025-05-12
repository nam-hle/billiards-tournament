import React from "react";

import { SwitchGroupMessage } from "@/components/layouts/messages/switch-group-message";

import { type Group } from "@/schemas";
import { type Container } from "@/types";
import { getCurrentUser } from "@/services/supabase/server";

namespace CorrectGroupGuard {
	export interface Props extends Container {
		readonly expectedGroup: Group;
	}
}

export const CorrectGroupGuard: React.FC<CorrectGroupGuard.Props> = async ({ children, expectedGroup }) => {
	const { group: currentGroup } = await getCurrentUser();

	if (currentGroup?.id !== expectedGroup.id) {
		return <SwitchGroupMessage groupId={expectedGroup.id} groupName={expectedGroup.name} />;
	}

	return <>{children}</>;
};
