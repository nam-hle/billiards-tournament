"use client";

import React from "react";

import { PageHeader } from "@/components/layouts/page-header";
import { PageContainer } from "@/components/layouts/page-container";

import FAQ from "@/markdown/faq.md";

export default function Page() {
	return (
		<PageContainer items={[{ label: "FAQ", href: "/faq" }]}>
			<PageHeader
				title="FAQ"
				description=" Find quick answers to the most common questions about our features, tournament rules, player rankings, and scheduling."
			/>
			<article className="prose max-w-full lg:prose-xl">
				<FAQ />
			</article>
		</PageContainer>
	);
}
