import { revalidatePath } from "next/cache";

import { assert } from "@/utils";
import { type Balance } from "@/types";
import { GroupController } from "@/controllers";
import { type SupabaseInstance } from "@/services/supabase/server";
import {
	type Group,
	type Invite,
	type Profile,
	type TrpcResponse,
	type LoginFormState,
	type SignUpFormState,
	type ProfileFormState,
	MembershipStatusSchema
} from "@/schemas";

export namespace UserControllers {
	export const USER_META_BASE_SELECT = `
    userId:id,
    fullName:full_name
  `;

	export const USER_META_SELECT = `
	  ${USER_META_BASE_SELECT},
    avatarFile:avatar_file
  `;

	export async function updateProfile(supabase: SupabaseInstance, userId: string, payload: ProfileFormState) {
		const { data } = await supabase
			.from("profiles")
			.update({ full_name: payload.fullName, avatar_file: payload.avatarFile })
			.eq("id", userId)
			.select(USER_META_SELECT)
			.single()
			.throwOnError();

		assert(data, "Profile not found");

		return { fullName: data.fullName, avatarFile: data.avatarFile };
	}

	export async function reportUsingView(supabase: SupabaseInstance, payload: { userId: string; groupId: string }): Promise<Balance> {
		const { data } = await supabase
			.from("user_financial_summary")
			.select("*")
			.eq("user_id", payload.userId)
			.eq("group_id", payload.groupId)
			.single()
			.throwOnError();

		return { paid: data?.paid ?? 0, sent: data?.sent ?? 0, owed: data?.owed ?? 0, net: data?.balance ?? 0, received: data?.received ?? 0 };
	}

	export async function getProfile(supabase: SupabaseInstance, userId: string): Promise<Profile> {
		const { data: profile } = await supabase.from("profiles").select(USER_META_SELECT).eq("id", userId).single().throwOnError();

		if (!profile) {
			throw new Error("Profile not found");
		}

		const { data: user, error: userError } = await supabase.auth.getUser();

		if (userError || !user) {
			throw new Error(userError?.message || "User not found");
		}

		assert(user.user?.email, "User email not found");

		return { ...profile, email: user.user.email };
	}

	export async function getGroups(supabase: SupabaseInstance, payload: { userId: string }): Promise<Group[]> {
		const { data } = await supabase
			.from("memberships")
			.select(GroupController.MEMBERSHIP_SELECT)
			.eq("user_id", payload.userId)
			.eq("status", MembershipStatusSchema.enum.Active)
			.order("created_at", { ascending: true })
			.throwOnError();

		return data?.map(({ group }) => group) ?? [];
	}

	export async function selectGroup(supabase: SupabaseInstance, payload: { userId: string; groupId: string | null }): Promise<void> {
		await supabase.from("profiles").update({ selected_group_id: payload.groupId }).eq("id", payload.userId).throwOnError();
	}

	export async function getSelectedGroup(supabase: SupabaseInstance, userId: string): Promise<(Group & { balance: number }) | null> {
		const { data } = await supabase
			.from("profiles")
			.select(`group:groups!selected_group_id (${GroupController.GROUP_SELECT})`)
			.eq("id", userId)
			.single()
			.throwOnError();

		if (!data?.group) {
			return null;
		}

		const { net } = await reportUsingView(supabase, { userId, groupId: data.group.id });

		return { ...data.group, balance: net };
	}

	export async function getGroupRequests(supabase: SupabaseInstance, payload: { userId: string }): Promise<Group[]> {
		const { data } = await supabase
			.from("memberships")
			.select(`group:groups!group_id (${GroupController.GROUP_SELECT})`)
			.eq("user_id", payload.userId)
			.eq("status", MembershipStatusSchema.enum.Requesting)
			.throwOnError();

		return data?.map(({ group }) => group) ?? [];
	}

	export async function getGroupInvites(supabase: SupabaseInstance, payload: { userId: string }): Promise<Invite[]> {
		const { data } = await supabase
			.from("memberships")
			.select(`id, group:groups!group_id (${GroupController.GROUP_SELECT})`)
			.eq("user_id", payload.userId)
			.eq("status", MembershipStatusSchema.enum.Inviting)
			.throwOnError();

		return data ?? [];
	}

	export async function findByName(supabase: SupabaseInstance, payload: { textSearch: string }) {
		const { data, count } = await supabase
			.from("profiles")
			.select(USER_META_SELECT)
			.filter("full_name", "ilike", `%${payload.textSearch}%`)
			.throwOnError();

		return { data: data ?? [], fullSize: count ?? 0 };
	}

	export async function signUp(supabase: SupabaseInstance, payload: SignUpFormState): Promise<TrpcResponse> {
		const { email, password, fullName } = payload;

		const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });

		if (error) {
			return { ok: false, error: error.message };
		}

		return { ok: true };
	}

	export async function logout(supabase: SupabaseInstance) {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			await supabase.auth.signOut();
		}

		revalidatePath("/", "layout");
	}

	export async function login(supabase: SupabaseInstance, payload: LoginFormState): Promise<TrpcResponse> {
		const { error } = await supabase.auth.signInWithPassword(payload);

		if (error) {
			return { ok: false, error: error.message };
		}

		return { ok: true };
	}
}
