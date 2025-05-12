import { z } from "zod";

export const UserMetaBaseSchema = z.object({ userId: z.string(), fullName: z.string() }).strict();

export const UserMetaSchema = UserMetaBaseSchema.extend({ avatarFile: z.string().nullable() }).strict();
export type UserMeta = z.infer<typeof UserMetaSchema>;

export const UserFinanceSchema = UserMetaBaseSchema.extend({ balance: z.number() }).strict();
export type UserFinance = z.infer<typeof UserFinanceSchema>;

export const ProfileSchema = UserMetaSchema.extend({ email: z.string() }).strict();
export type Profile = z.infer<typeof ProfileSchema>;

export const ProfileFormStateSchema = UserMetaSchema.omit({ userId: true }).strict();
export type ProfileFormState = z.infer<typeof ProfileFormStateSchema>;

export const LoginFormStateSchema = z
	.object({
		email: z.string().min(1, "Email is required").email("Invalid email address"),
		password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters")
	})
	.strict();
export type LoginFormState = z.infer<typeof LoginFormStateSchema>;

export const SignUpFormStateSchema = LoginFormStateSchema.extend({
	fullName: z.string().min(1, "Display name is required"),
	confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"],
	message: "Passwords do not match"
});
export type SignUpFormState = z.infer<typeof SignUpFormStateSchema>;
