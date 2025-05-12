import { UserControllers } from "@/controllers";
import { assert, GroupIdGenerator } from "@/utils";
import { pickUniqueId } from "@/controllers/utils";
import { type SupabaseInstance } from "@/services/supabase/server";
import { type MemberAction, changeMemberStatus } from "@/controllers/member-transition";
import {
	type Group,
	type UserMeta,
	type Membership,
	type UserFinance,
	type GroupDetails,
	type MembershipKey,
	type MembershipStatus,
	MembershipStatusSchema,
	type GroupDetailsWithBalance,
	type MembershipResponseChange
} from "@/schemas";

export namespace GroupController {
	export const GROUP_SELECT = `
    id,
    name,
    displayId:display_id
  `;

	export const MEMBERSHIP_SELECT = `	
		status,
		user:profiles!user_id (${UserControllers.USER_META_SELECT}),
		group:groups!group_id (${GROUP_SELECT})
	`;

	export interface CreationPayload {
		name: string;
		creatorId: string;
	}

	export async function create(supabase: SupabaseInstance, payload: CreationPayload): Promise<Group> {
		const displayId = await pickUniqueId(supabase, "groups", "display_id", GroupIdGenerator);
		const { data, error } = await supabase.from("groups").insert({ name: payload.name, display_id: displayId }).select(GROUP_SELECT).single();

		if (error) {
			throw error;
		}

		assert(data);

		await supabase.from("memberships").insert({ group_id: data.id, user_id: payload.creatorId, status: MembershipStatusSchema.enum.Active });

		return data;
	}

	export async function isMember(supabase: SupabaseInstance, payload: { userId: string; groupId: string }): Promise<boolean> {
		const { data } = await supabase
			.from("memberships")
			.select("id")
			.eq("group_id", payload.groupId)
			.eq("user_id", payload.userId)
			.eq("status", MembershipStatusSchema.enum.Active)
			.single();

		return !!data;
	}

	export async function updateName(supabase: SupabaseInstance, payload: { name: string; groupId: string }): Promise<void> {
		await supabase.from("groups").update({ name: payload.name }).eq("id", payload.groupId);
	}

	export async function getCandidateMembers(supabase: SupabaseInstance, payload: { groupId: string; textSearch: string }): Promise<UserMeta[]> {
		const activeOrPendingMemberIds = (
			await getMembershipsByStatus(supabase, {
				...payload,
				statuses: [MembershipStatusSchema.enum.Active, MembershipStatusSchema.enum.Requesting, MembershipStatusSchema.enum.Inviting]
			})
		).map((e) => e.user.userId);
		const users = await UserControllers.findByName(supabase, payload);

		return users.data.filter(({ userId }) => !activeOrPendingMemberIds.includes(userId));
	}

	export async function getActiveMembers(supabase: SupabaseInstance, payload: { groupId: string; exclusions?: string[] }): Promise<UserMeta[]> {
		const members = await getMembershipsByStatus(supabase, { ...payload, statuses: [MembershipStatusSchema.enum.Active] });

		return members.flatMap(({ user }) => {
			if (payload.exclusions?.includes(user.userId)) {
				return [];
			}

			return user;
		});
	}

	export async function getUserFinances(supabase: SupabaseInstance, payload: { groupId: string; exclusions?: string[] }): Promise<UserFinance[]> {
		const activeMembers = await getActiveMembers(supabase, payload);

		const { data: balances } = await supabase
			.from("user_financial_summary")
			.select("balance, user_id")
			.eq("group_id", payload.groupId)
			.order("balance", { ascending: true })
			.throwOnError();

		return activeMembers.map(({ userId, fullName }) => {
			return { userId, fullName, balance: balances?.find((balance) => balance.user_id === userId)?.balance ?? 0 };
		});
	}

	export async function getGroups(supabase: SupabaseInstance, payload: { userId: string }): Promise<GroupDetails[]> {
		const { data: groups } = await supabase
			.from("memberships")
			.select(`group:groups!group_id (${GROUP_SELECT})`)
			.eq("user_id", payload.userId)
			.eq("status", MembershipStatusSchema.enum.Active);

		return Promise.all(groups?.map((group) => getGroupDetailsByDisplayId(supabase, { displayId: group.group.displayId })) ?? []);
	}

	export async function getGroupsWithBalance(supabase: SupabaseInstance, payload: { userId: string }): Promise<GroupDetailsWithBalance[]> {
		const groupDetails = await getGroups(supabase, payload);

		return Promise.all(
			groupDetails.map(async (group) => {
				const report = await UserControllers.reportUsingView(supabase, { ...payload, groupId: group.id });

				return { ...group, balance: report.net };
			})
		);
	}

	export async function getGroupDetailsByDisplayId(supabase: SupabaseInstance, payload: { displayId: string }): Promise<GroupDetails> {
		const { data: group } = await supabase.from("groups").select(GROUP_SELECT).eq("display_id", payload.displayId).single();

		if (!group) {
			throw new Error(`Group ${payload.displayId} does not exist`);
		}

		const members = await getActiveMembers(supabase, { groupId: group.id });

		return { ...group, members };
	}

	export async function findGroupByDisplayId(supabase: SupabaseInstance, payload: { displayId: string }): Promise<Group | null> {
		const { data } = await supabase.from("groups").select(GROUP_SELECT).eq("display_id", payload.displayId).single();

		return data;
	}

	export async function getMembershipsByStatus(
		supabase: SupabaseInstance,
		payload: { groupId: string; statuses: [MembershipStatus, ...MembershipStatus[]] }
	): Promise<Membership[]> {
		const { data, error } = await supabase
			.from("memberships")
			.select(`id, status, user:profiles!user_id (${UserControllers.USER_META_SELECT})`)
			.eq("group_id", payload.groupId)
			.in("status", payload.statuses)
			.order("created_at", { ascending: true });

		if (error) {
			throw error;
		}

		return data;
	}

	async function findMembershipByKey(
		supabase: SupabaseInstance,
		payload: { userId: string; groupId: string }
	): Promise<{ id: string; status: MembershipStatus } | null> {
		const { data } = await supabase.from("memberships").select("id, status").eq("group_id", payload.groupId).eq("user_id", payload.userId).single();

		return data;
	}

	export async function findMembershipById(
		supabase: SupabaseInstance,
		payload: { membershipId: string }
	): Promise<{ id: string; status: MembershipStatus }> {
		const { data } = await supabase.from("memberships").select("id, status").eq("id", payload.membershipId).single();

		if (!data) {
			throw new Error("Membership not found");
		}

		return data;
	}

	async function getCurrentMembershipStatus(supabase: SupabaseInstance, payload: MembershipKey): Promise<MembershipStatus> {
		const membership = await findMembershipByKey(supabase, payload);

		return membership?.status ?? MembershipStatusSchema.enum.Idle;
	}

	// TODO: Verify user and group existence
	export async function changeMembershipStatus(
		supabase: SupabaseInstance,
		payload: MembershipKey & { action: MemberAction }
	): Promise<MembershipResponseChange> {
		const currentStatus = await getCurrentMembershipStatus(supabase, payload);
		const result = changeMemberStatus(currentStatus, payload.action);

		if (!result.ok) {
			return result;
		}

		await supabase.from("memberships").upsert({ user_id: payload.userId, status: result.newStatus, group_id: payload.groupId });

		return { ok: true };
	}

	export async function resolvePendingStatus(
		supabase: SupabaseInstance,
		payload: { membershipId: string; action: MemberAction }
	): Promise<MembershipResponseChange> {
		const membership = await findMembershipById(supabase, payload);

		const result = changeMemberStatus(membership.status, payload.action);

		if (!result.ok) {
			return result;
		}

		await supabase.from("memberships").update({ status: result.newStatus }).eq("id", membership.id);

		return { ok: true };
	}
}
