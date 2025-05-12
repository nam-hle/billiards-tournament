import React from "react";

namespace Message {
	export interface Props {
		readonly title: string;
		readonly action?: React.ReactNode;
		readonly description?: React.ReactNode;
	}
}

export const Message: React.FC<Message.Props> = ({ title, action, description }) => (
	<div className="flex flex-col items-center justify-center p-6 text-center">
		<h3 className="text-lg font-semibold text-gray-700">{title}</h3>
		{description && <p className="mb-4 text-sm text-gray-500">{description}</p>}
		{action}
	</div>
);
