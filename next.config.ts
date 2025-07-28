import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		typedRoutes: true
	},
	env: {
		BUILD_TIME: new Date().toISOString()
	},
	images: {
		remotePatterns: [{ protocol: "https", hostname: "avatar.vercel.sh" }]
	}
};

export default nextConfig;
