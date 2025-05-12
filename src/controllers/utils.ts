import { TRPCError } from "@trpc/server";

import { assert } from "@/utils";
import { GroupController } from "@/controllers";
import { type Database } from "@/database.types";
import { type SupabaseInstance } from "@/services/supabase/server";

export type TableName = keyof Database["public"]["Tables"];
const MAX_ROUND = 10;
export async function pickUniqueId<Table extends TableName = "groups">(
	supabase: SupabaseInstance,
	table: Table,
	columnName: keyof Database["public"]["Tables"][Table]["Row"],
	generator: () => string
) {
	let id: string,
		found = false,
		round = 0;

	while (true) {
		id = generator();

		if (round++ > MAX_ROUND) {
			throw new Error("Exceeded maximum rounds");
		}

		const { data } = await supabase
			.from(table)
			.select(columnName as string)
			.eq(columnName as any, id)
			.limit(1);

		if (!data || data.length === 0) {
			found = true;
			break;
		}
	}

	assert(found, "Failed to find unique id");

	return id;
}

export async function ensureAuthorized(supabase: SupabaseInstance, payload: { userId: string; groupId: string }) {
	const isMember = await GroupController.isMember(supabase, payload);

	if (!isMember) {
		throw new TRPCError({ code: "FORBIDDEN", message: "You do not have the necessary permissions to access this resource" });
	}
}
