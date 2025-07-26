import React from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcn/breadcrumb";

namespace PageBreadcrumb {
	interface Item {
		readonly label: string;
		readonly href?: string;
	}

	export interface Props {
		readonly items: Item[];
	}
}

export const PageBreadcrumb: React.FC<PageBreadcrumb.Props> = ({ items }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => {
					if (index === items.length - 1) {
						return (
							<BreadcrumbItem key={item.label}>
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							</BreadcrumbItem>
						);
					}

					return (
						<React.Fragment key={item.label}>
							<BreadcrumbItem>
								<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
