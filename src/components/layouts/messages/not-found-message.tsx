import React from "react";
import Link from "next/link";
import { House } from "lucide-react";

import { Button } from "@/components/shadcn/button";

import { Message } from "@/components/mics/message";

export const NotFoundMessage = () => (
	<Message
		title="Look like this page doesn't exist"
		description="Go back to home and continue exploring"
		action={
			<Button asChild size="sm">
				<Link href="/">
					<House /> Back to Home
				</Link>
			</Button>
		}
	/>
);
