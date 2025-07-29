import React from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/shadcn/breadcrumb";

export namespace PageBreadcrumb {
	export interface Item {
		readonly href: string;
		readonly label: string;
	}

	export interface Props {
		readonly items: Item[];
	}
}

export const PageBreadcrumb: React.FC<PageBreadcrumb.Props> = ({ items }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map(({ href, label }, index) => (
					<React.Fragment key={label}>
						<BreadcrumbItem>
							<BreadcrumbLink href={href}>{label}</BreadcrumbLink>
						</BreadcrumbItem>
						{index !== items.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
