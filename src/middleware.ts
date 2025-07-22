import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME, COOKIE_VALUE } from "@/constants";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow access to /auth and /api/authenticate
	if (pathname.startsWith("/auth") || pathname.startsWith("/api/authenticate")) {
		return NextResponse.next();
	}

	const token = request.cookies.get(COOKIE_NAME)?.value;

	if (token !== COOKIE_VALUE) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth";
		url.search = `redirect=${encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)}`;

		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Exclude static, images, favicon, and public assets
		"/((?!_next/static|_next/image|favicon.ico|auth|api/authenticate|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
	]
};
