"use client";

import React from "react";

import { Button } from "@/components/shadcn/button";

import { Message } from "@/components/mics/message";

import { useSwitchGroup } from "@/utils/use-switch-group";

namespace SwitchGroupMessage {
	export interface Props {
		readonly groupId: string;
		readonly groupName: string;
	}
}

export const SwitchGroupMessage: React.FC<SwitchGroupMessage.Props> = ({ groupId, groupName }) => {
	const switchGroup = useSwitchGroup();

	return (
		<Message
			title="Switch Group Required"
			action={
				<Button size="sm" onClick={() => switchGroup.mutate({ groupId })}>
					Switch group
				</Button>
			}
			description={
				<>
					You need to switch to group <span className="font-semibold text-gray-700">{groupName}</span> to access this page
				</>
			}
		/>
	);
};
