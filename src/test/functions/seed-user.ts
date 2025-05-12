import { supabaseTest } from "@/test/setup";
import { type UserName, DEFAULT_PASSWORD } from "@/test/utils";

export async function seedUser(params: { email: UserName; fullName: string; password?: string }): Promise<string> {
	const { email, fullName, password = DEFAULT_PASSWORD } = params;
	const fullEmail = `${email}@example.com`;

	const { data, error } = await supabaseTest.auth.admin.createUser({
		password,
		email: fullEmail,
		email_confirm: true,
		user_metadata: { full_name: fullName }
	});

	if (error) {
		throw error;
	}

	if (!data) {
		throw new Error("Can not get user data");
	}

	return data.user.id;
}
