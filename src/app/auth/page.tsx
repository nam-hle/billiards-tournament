"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, Lock, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Button } from "@/components/shadcn/button";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/shadcn/card";

export default function Page() {
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const searchParams = useSearchParams();
	const redirectPath = searchParams.get("redirect") || "/";
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password");

		try {
			const res = await fetch("/api/authenticate", {
				method: "POST",
				body: JSON.stringify({ password }),
				headers: { "Content-Type": "application/json" }
			});

			if (res.ok) {
				window.location.replace(redirectPath);
			} else {
				setError("Invalid password. Please try again.");
			}
		} catch (error) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
						<Lock className="h-6 w-6 text-blue-600" />
					</div>
					<CardTitle className="text-2xl font-bold">Access Required</CardTitle>
					<CardDescription>Enter the access password to continue</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									required
									id="password"
									name="password"
									className="pr-10"
									disabled={isLoading}
									placeholder="Enter access password"
									type={showPassword ? "text" : "password"}
								/>
								<Button
									size="sm"
									type="button"
									variant="ghost"
									disabled={isLoading}
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
									{showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
									<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
								</Button>
							</div>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Verifying...
								</>
							) : (
								"Enter"
							)}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">Need help? Contact your administrator</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
