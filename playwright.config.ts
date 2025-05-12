import { devices, defineConfig } from "@playwright/test";

const LOCAL_PORT: number = process.env.CI ? 4000 : 3000;
const PROD = LOCAL_PORT === 4000;
const profiles = {
	CI: {
		port: 4000,
		retries: 2,
		timeout: 60_000,
		reporter: "list",
		forbidOnly: true,
		command: "pnpm start",
		expectTimeout: 20_000,
		reuseExistingServer: false,
		video: "retain-on-failure"
	},
	LOCAL: {
		retries: 0,
		video: "on",
		port: LOCAL_PORT,
		reporter: "html",
		forbidOnly: false,
		expectTimeout: 10_000,
		reuseExistingServer: true,
		timeout: PROD ? 30_000 : 50_000,
		command: PROD ? "pnpm start" : "pnpm dev"
	}
} as const;

const profile = profiles[process.env.CI ? "CI" : "LOCAL"];

// To calculate url for test trpc requests
process.env.PORT = String(profile.port);

export default defineConfig({
	fullyParallel: false,
	timeout: profile.timeout,
	retries: profile.retries,
	reporter: profile.reporter,
	testDir: "./src/test/specs",
	forbidOnly: profile.forbidOnly,
	expect: {
		timeout: profile.expectTimeout
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	],
	use: {
		video: profile.video,
		trace: "retain-on-failure",
		baseURL: `http://127.0.0.1:${profile.port}`
	},

	webServer: [
		{
			stdout: "pipe",
			stderr: "pipe",
			timeout: 60_000,
			command: profile.command,
			url: `http://127.0.0.1:${profile.port}`,
			reuseExistingServer: profile.reuseExistingServer
		},
		{
			reuseExistingServer: true,
			url: `http://127.0.0.1:3001`,
			command: "pnpm start:qr-server"
		}
	]
});
