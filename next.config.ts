import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
	experimental: {
		typedRoutes: true
	},
	env: {
		BUILD_TIME: new Date().toISOString()
	},
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	images: {
		remotePatterns: [{ protocol: "https", hostname: "avatar.vercel.sh" }]
	}
};

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
	options: {
		rehypePlugins: [rehypeSlug]
	}
});

export default withMDX(nextConfig);
