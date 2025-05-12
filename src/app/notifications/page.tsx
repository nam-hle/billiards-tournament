import React from "react";
import { type Metadata } from "next";

import { NotificationsTable } from "@/components/tables";

export const metadata: Metadata = {
	title: "Notifications"
};

export default async function NotificationsPage() {
	return <NotificationsTable />;
}
