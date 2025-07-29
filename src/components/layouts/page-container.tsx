import React from "react";

import { PageBreadcrumb } from "@/components/page-breadcrumb";

import { type Container } from "@/types";

export namespace PageContainer {
	export interface Props extends Container {
		readonly items: PageBreadcrumb.Item[];
	}
}
export const PageContainer: React.FC<PageContainer.Props> = ({ items, children }) => {
	return (
		<div className="container mx-auto space-y-8 py-6">
			<PageBreadcrumb items={items} />
			{children}
		</div>
	);
};
