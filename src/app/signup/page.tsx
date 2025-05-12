import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/forms/sign-up-form";

import { createSupabaseServer } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Sign Up"
};

export default async function SignUpPage() {
	const supabase = await createSupabaseServer();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/dashboard");
	}

	return <SignUpForm />;
}
