"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Form, FormItem, FormField, FormControl, FormMessage } from "@/components/shadcn/form";
import { Card, CardTitle, CardHeader, CardFooter, CardContent, CardDescription } from "@/components/shadcn/card";

import { RequiredLabel } from "@/components/forms/required-label";

import { cn } from "@/utils/cn";
import { signup } from "@/app/login/actions";
import { type SignUpFormState, SignUpFormStateSchema } from "@/schemas";

export function SignUpForm() {
	const form = useForm<SignUpFormState>({
		resolver: zodResolver(SignUpFormStateSchema),
		defaultValues: { email: "", password: "", fullName: "", confirmPassword: "" }
	});

	const {
		control,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = form;

	const onSubmit = React.useMemo(
		() =>
			handleSubmit(async (data) => {
				const error = await signup(data);

				if (error) {
					setError("root", { message: error });
				}
			}),
		[handleSubmit, setError]
	);

	return (
		<Form {...form}>
			<div className={cn("mx-auto mt-24 w-[400px] flex-1 items-center")}>
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-2xl">Sign Up</CardTitle>
						<CardDescription>Create a new account to get started</CardDescription>
					</CardHeader>
					<form onSubmit={onSubmit}>
						<CardContent>
							<div className="flex flex-col gap-6">
								{errors.root && (
									<Alert className="py-2" variant="destructive" data-testid="form-root-error">
										<AlertDescription>{errors.root.message}</AlertDescription>
									</Alert>
								)}
								<FormField
									name="fullName"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Display Name</RequiredLabel>
											<FormControl>
												<Input placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="email"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Email</RequiredLabel>
											<FormControl>
												<Input placeholder="john.doe@example.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="password"
									control={control}
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Password</RequiredLabel>
											<FormControl>
												<Input id="password" type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<RequiredLabel>Confirm Password</RequiredLabel>
											<FormControl>
												<Input type="password" id="confirm-password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting && <Loader2 className="animate-spin" />}
								Create Account
							</Button>
							<p className="text-sm text-gray-600">
								Already have an account?{" "}
								<Link href="/login" className="text-primary underline underline-offset-4">
									Login here
								</Link>
							</p>
						</CardFooter>
					</form>
				</Card>
			</div>
		</Form>
	);
}
