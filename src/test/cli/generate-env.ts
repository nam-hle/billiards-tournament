import util from "util";
import Fs from "fs/promises";
import { exec } from "child_process";

const execPromise = util.promisify(exec);
async function writeEnvFile() {
	const { stdout } = await execPromise("supabase status -o json");

	const supabaseEnvs = JSON.parse(stdout);

	const envs: Record<string, string> = {};

	envs[`NEXT_PUBLIC_SUPABASE_ANON_KEY`] = supabaseEnvs["ANON_KEY"];
	envs[`SUPABASE_SERVICE_ROLE_KEY`] = supabaseEnvs["SERVICE_ROLE_KEY"];

	let currentLocalEnv = "";

	try {
		currentLocalEnv = await Fs.readFile(".env.local", "utf-8");
	} catch (error) {
		console.log("No .env.local file found, creating a new one");
	}

	await Fs.writeFile(
		".env.local",
		`${currentLocalEnv}\n` +
			Object.entries(envs)
				.map(([key, value]) => `${key}=${value}`)
				.join("\n")
	);
}

writeEnvFile()
	.then(() => {
		console.log("Environment variables written to .env.local");
	})
	.catch((err) => {
		console.error(err);
	});
