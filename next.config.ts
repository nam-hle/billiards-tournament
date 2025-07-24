import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		BUILD_TIME: new Date().toISOString()
	},
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"]
	},
	images: {
		remotePatterns: [{ protocol: "https", hostname: "avatar.vercel.sh" }]
	}
};

export default nextConfig;
