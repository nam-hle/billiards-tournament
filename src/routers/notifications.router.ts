import { z } from "zod";
import { observable } from "@trpc/server/observable";

import { notificationEvents } from "@/services";
import { NotificationsControllers } from "@/controllers";
import { router, privateProcedure } from "@/services/trpc/server";
import { type ClientNotification, InfiniteNotificationResponseSchema, PaginatedNotificationResponseSchema } from "@/schemas";

export const notificationsRouter = router({
	readAll: privateProcedure.mutation(({ ctx: { user, supabase } }) => NotificationsControllers.readAll(supabase, user.id)),
	getUnread: privateProcedure.output(z.number()).query(({ ctx: { user, supabase } }) => NotificationsControllers.getUnread(supabase, user.id)),
	read: privateProcedure
		.input(z.object({ notificationId: z.string() }))
		.mutation(async ({ input, ctx: { user, supabase } }) => NotificationsControllers.read(supabase, user.id, input.notificationId)),
	getPaginated: privateProcedure
		.input(z.object({ page: z.number() }))
		.output(PaginatedNotificationResponseSchema)
		.query(({ input, ctx: { user, supabase } }) => NotificationsControllers.getByPage(supabase, user.id, input)),
	getInfinite: privateProcedure
		.input(z.object({ cursor: z.string().nullish() }))
		.output(InfiniteNotificationResponseSchema)
		.query(({ input, ctx: { user, supabase } }) => NotificationsControllers.getByCursor(supabase, user.id, input)),

	onConnect: privateProcedure.subscription(({ ctx }) => {
		return observable<ClientNotification>((emit) => {
			const handler = (notifications: ClientNotification[]) => {
				for (const notification of notifications) {
					if (notification.userId === ctx.user.id) {
						emit.next(notification);
					}
				}
			};

			notificationEvents.on("notification:new", handler);

			return () => {
				notificationEvents.off("notification:new", handler);
			};
		});
	})
});
