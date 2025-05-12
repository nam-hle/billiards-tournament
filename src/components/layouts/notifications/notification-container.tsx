"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";

import { Message } from "@/components/mics/message";
import { CounterBadge } from "@/components/mics/counter-badge";
import { renderMessage, NotificationMessage } from "@/components/layouts/notifications/notification-message";

import { trpc } from "@/services";

export const NotificationContainer = () => {
	useSubscription();
	const { read, readAll } = useMutation();

	const {
		hasNextPage,
		fetchNextPage,
		data: initialData,
		isFetchingPreviousPage
	} = trpc.notifications.getInfinite.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor });

	const { data: unreadCount } = trpc.notifications.getUnread.useQuery();

	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size="icon" variant="outline" className="relative h-8 w-8 rounded-full" data-testid="navigation-item-notifications">
					<Bell />
					<CounterBadge count={unreadCount} />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-90 w-[400px] p-2">
				{initialData?.pages[0].notifications.length === 0 ? (
					<Message title="You have no notifications" />
				) : (
					<div className="flex max-h-[500px] flex-col gap-2 overflow-y-auto">
						<div className="flex justify-between">
							<Button asChild size="sm" variant="ghost" onClick={() => setOpen(false)} className="cursor-pointer px-2">
								<Link href="/notifications">See more</Link>
							</Button>
							<Button size="sm" variant="ghost" onClick={() => readAll()} disabled={unreadCount === 0} className="cursor-pointer px-2">
								Mark all as read
							</Button>
						</div>

						<div className="flex flex-col gap-0">
							{initialData?.pages.flatMap((page) => {
								return page.notifications.map((notification) => (
									<NotificationMessage
										key={notification.id}
										notification={notification}
										onClick={() => {
											setOpen(false);
											read({ notificationId: notification.id });
										}}
									/>
								));
							})}
						</div>

						<div className="w-full">
							<Button
								variant="ghost"
								className="w-full"
								onClick={() => fetchNextPage()}
								aria-label="Load older notifications"
								disabled={isFetchingPreviousPage || !hasNextPage}>
								{hasNextPage ? "Load older notifications" : "No more notifications"}
							</Button>
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
};

function useSubscription() {
	const utils = trpc.useUtils();

	trpc.notifications.onConnect.useSubscription(undefined, {
		onData(newNotification) {
			toast.info(renderMessage(newNotification));

			utils.notifications.getUnread.setData(undefined, (oldCount) => (oldCount || 0) + 1);
			utils.notifications.getInfinite.setInfiniteData({}, (oldData) => {
				if (!oldData) {
					return oldData;
				}

				const firstPage = oldData.pages[0];

				if (firstPage.notifications.some(({ id }) => id === newNotification.id)) {
					return oldData;
				}

				return { ...oldData, pages: [{ ...firstPage, notifications: [newNotification, ...firstPage.notifications] }, ...oldData.pages.slice(1)] };
			});
		}
	});
}

function useMutation() {
	const utils = trpc.useUtils();
	const { mutate: readAll } = trpc.notifications.readAll.useMutation({
		onSuccess() {
			utils.notifications.getUnread.invalidate();
		}
	});
	const { mutate: read } = trpc.notifications.read.useMutation({
		onSuccess(_data, variables) {
			utils.notifications.getUnread.setData(undefined, (oldCount) => (oldCount || 0) + 1);
			utils.notifications.getInfinite.setInfiniteData({}, (oldPages) => {
				if (!oldPages) {
					return oldPages;
				}

				return {
					...oldPages,
					pages: oldPages.pages.map((page) => {
						return {
							...page,
							notifications: page.notifications.map((notification) => ({
								...notification,
								readStatus: notification.id === variables.notificationId ? true : notification.readStatus
							}))
						};
					})
				};
			});
		}
	});

	return { read, readAll };
}
