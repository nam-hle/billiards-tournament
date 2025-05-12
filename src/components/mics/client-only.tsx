"use client";

import React from "react";

import { Show } from "@/components/mics/show";

interface ClientOnlyProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}
export const ClientOnly = (props: ClientOnlyProps) => {
	const { children, fallback } = props;
	const [hasMounted, setHasMounted] = React.useState<true | undefined>(undefined);

	React.useEffect(() => {
		setHasMounted(true);
	}, []);

	return (
		<Show when={hasMounted} fallback={fallback}>
			{children}
		</Show>
	);
};
