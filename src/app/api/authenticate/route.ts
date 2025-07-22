import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_NAME, COOKIE_VALUE } from "@/constants";

const PASSWORD = process.env.APP_PASSWORD;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 3;

export async function POST(req: NextRequest) {
	const data = await req.json();

	if (data.password === PASSWORD) {
		const res = NextResponse.json({ success: true });
		res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: COOKIE_MAX_AGE
		});

		return res;
	}

	return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}
