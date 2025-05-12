import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";

import { createSupabaseServer } from "@/services/supabase/server";

export const metadata: Metadata = {
	title: "Login"
};

export default async function LoginPage() {
	const supabase = await createSupabaseServer();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (user) {
		redirect("/dashboard");
	}

	return <LoginForm />;
}
