import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ["@chakra-ui/react"]
	},
	distDir: process.env.NODE_ENV === "production" ? ".next" : ".next-dev"
};

export default nextConfig;
