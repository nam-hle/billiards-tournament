import React from "react";

export namespace PageHeader {
	export interface Props {
		readonly title: string;
		readonly description: string;
	}
}
export const PageHeader: React.FC<PageHeader.Props> = ({ title, description }) => {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				<p className="text-xl text-muted-foreground">{description}</p>
			</div>
		</div>
	);
};
