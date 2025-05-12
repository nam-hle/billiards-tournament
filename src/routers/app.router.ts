import { router } from "@/services/trpc/server";
import { userRouter } from "@/routers/user.router";
import { billsRouter } from "@/routers/bills.router";
import { banksRouter } from "@/routers/banks.router";
import { groupsRouter } from "@/routers/groups.router";
import { storageRouter } from "@/routers/storage.router";
import { transactionsRouter } from "@/routers/transactions.router";
import { notificationsRouter } from "@/routers/notifications.router";

export const appRouter = router({
	user: userRouter,
	bills: billsRouter,
	banks: banksRouter,
	groups: groupsRouter,
	storage: storageRouter,
	transactions: transactionsRouter,
	notifications: notificationsRouter
});

export type AppRouter = typeof appRouter;
