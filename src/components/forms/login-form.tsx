"use client";

import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from "@/components/shadcn/form";

import { cn } from "@/utils/cn";
import { login } from "@/app/login/actions";
import { type LoginFormState, LoginFormStateSchema } from "@/schemas";

export function LoginForm() {
	const form = useForm<LoginFormState>({
		defaultValues: { email: "", password: "" },
		resolver: zodResolver(LoginFormStateSchema)
	});

	const {
		control,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = form;

	const onLogin = async (data: { email: string; password: string }) => {
		const error = await login(data);

		if (error) {
			setError("root", { message: error });
		}
	};

	return (
		<Form {...form}>
			<div className={cn("mx-auto mt-24 w-[400px] flex-1 items-center")}>
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>Enter your email below to login to your account</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onLogin)}>
							<div className="flex flex-col gap-6">
								{errors.root && (
									<Alert className="py-2" variant="destructive" data-testid="form-root-error">
										<AlertDescription>{errors.root.message}</AlertDescription>
									</Alert>
								)}
								<div className="grid gap-2">
									<FormField
										name="email"
										control={control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="Enter your email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									name="password"
									control={control}
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center">
												<FormLabel>Password</FormLabel>
												<a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
													Forgot your password?
												</a>
											</div>
											<FormControl>
												<Input id="password" type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full" disabled={isSubmitting}>
									{isSubmitting && <Loader2 className="animate-spin" />}
									Login
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								Don&apos;t have an account?{" "}
								<Link href="/signup" className="text-primary underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</Form>
	);
}
