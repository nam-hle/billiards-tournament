"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createCaller } from "@/services/trpc/caller";
import { type LoginFormState, type SignUpFormState } from "@/schemas";

export async function login(payload: LoginFormState) {
	const caller = await createCaller();
	const response = await caller.user.login(payload);

	if (!response.ok) {
		return response.error;
	}

	revalidatePath("/", "layout");
	redirect("/dashboard");
}

export async function signup(payload: SignUpFormState) {
	const caller = await createCaller();
	const response = await caller.user.signUp(payload);

	if (!response.ok) {
		return response.error;
	}

	revalidatePath("/", "layout");
	redirect("/profile");
}
