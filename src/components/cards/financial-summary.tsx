"use client";
import React from "react";
import { Frown, InfoIcon, PiggyBank, CreditCard, ArrowUpRight, ArrowDownLeft, type LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/shadcn/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/shadcn/tooltip";

import { Show } from "@/components/mics/show";
import { Heading } from "@/components/mics/heading";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { formatCurrency } from "@/utils/format";

export function FinancialSummary() {
	const { data } = trpc.user.getBalance.useQuery();

	return (
		<div className="col-span-2 flex flex-col gap-4">
			<Heading>Summary</Heading>
			<StatText
				Icon={PiggyBank}
				amount={data?.net}
				label="Net Balance"
				description="Your current balance"
				color={(data?.net ?? 0) >= 0 ? "text-green-600" : "text-red-600"}
			/>
			<StatText label="Owed" Icon={Frown} amount={data?.owed} color="text-red-600" description="Amount you owe to others" />
			<StatText label="Paid" Icon={CreditCard} amount={data?.paid} color="text-green-600" description="Amount you paid for bills" />
			<StatText label="Sent" Icon={ArrowUpRight} amount={data?.sent} color="text-red-600" description="Amount sent in transactions" />
			<StatText label="Received" Icon={ArrowDownLeft} color="text-green-600" amount={data?.received} description="Amount received in transactions" />
		</div>
	);
}

const StatText: React.FC<{ label: string; color: string; amount?: number; Icon: LucideIcon; description: string }> = (props) => {
	const { Icon, label, color, amount, description } = props;

	return (
		<Card data-testid="card">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle data-testid="card-title" className="text-sm font-medium">
					{label}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<InfoIcon className="ml-1 h-4 w-4 text-muted-foreground" />
							</TooltipTrigger>
							<TooltipContent>
								<p>{description}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</CardTitle>
				<Icon className={cn("h-4 w-4", color)} />
			</CardHeader>
			<CardContent data-testid="card-content">
				<Show when={amount} fallback={<Skeleton className="h-8 w-32" />}>
					{(amount) => <div className={cn("text-2xl font-bold", color)}>{formatCurrency(amount)}</div>}
				</Show>
			</CardContent>
		</Card>
	);
};
