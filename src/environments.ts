export const Environments = {
	PUBLIC: {
		APP: {
			PORT: process.env.PORT ?? 3000,
			URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		}
	}
};
