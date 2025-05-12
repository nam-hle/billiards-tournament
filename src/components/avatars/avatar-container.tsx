"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { User, Users, LogOut } from "lucide-react";

import { Skeleton } from "@/components/shadcn/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcn/avatar";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator
} from "@/components/shadcn/dropdown-menu";

import { trpc } from "@/services";
import { getAvatarFallback } from "@/utils/avatar-fallback";

const UserNav = () => {
	const { data: profile } = trpc.user.profile.useQuery();
	const { data: avatar } = trpc.storage.get.useQuery(
		{ bucketName: "avatars", fileName: profile?.avatarFile || "" },
		{ enabled: !!profile?.avatarFile }
	);

	return (
		<DropdownMenuTrigger asChild>
			<Avatar className="h-8 w-8 cursor-pointer" data-testid="navigation-item-profile">
				<AvatarImage src={avatar ?? undefined} />
				<AvatarFallback className="text-xs">{getAvatarFallback(profile?.fullName)}</AvatarFallback>
			</Avatar>
		</DropdownMenuTrigger>
	);
};

const UserNavInfo = () => {
	const { data: profile } = trpc.user.profile.useQuery();

	return (
		<DropdownMenuLabel className="font-normal">
			<div className="flex flex-col space-y-1">
				<p className="text-sm font-medium leading-none">{profile?.fullName}</p>
				<p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
			</div>
		</DropdownMenuLabel>
	);
};

export const AvatarContainer = () => {
	const router = useRouter();
	const signOut = trpc.user.logout.useMutation({
		onSuccess: () => {
			router.push("/login");
			router.refresh();
		}
	});

	return (
		<DropdownMenu>
			<Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
				<UserNav />
			</Suspense>
			<DropdownMenuContent forceMount align="end" className="w-56">
				<UserNavInfo />
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
						<User className="mr-2 h-4 w-4" />
						<span>Your profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/groups")}>
						<Users className="mr-2 h-4 w-4" />
						<span>Your groups</span>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer" onClick={() => signOut.mutate()}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
