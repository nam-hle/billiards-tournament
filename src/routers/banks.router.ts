import { z } from "zod";
import axios from "axios";

import { router, privateProcedure } from "@/services/trpc/server";

export const banksRouter = router({
	get: privateProcedure
		.output(z.array(z.object({ providerNumber: z.string(), providerFullName: z.string(), providerShortName: z.string() }).strict()))
		.query(async () => {
			const banksResponse = await axios.get("https://api.vietqr.io/v2/banks");

			const result = ResponseSchema.safeParse(banksResponse.data);

			if (!result.success) {
				throw new Error("Failed to parse response");
			}

			return result.data.data.map((bank) => ({ providerNumber: bank.bin, providerFullName: bank.name, providerShortName: bank.shortName }));
		})
});

const BankSchema = z.object({
	bin: z.string(),
	name: z.string(),
	shortName: z.string()
});

const ResponseSchema = z.object({
	data: z.array(BankSchema)
});
