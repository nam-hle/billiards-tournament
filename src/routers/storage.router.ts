import { z } from "zod";

import { BucketNameSchema } from "@/schemas";
import { router, privateProcedure } from "@/services/trpc/server";
import { StorageController } from "@/controllers/storage.controllers";

export const storageRouter = router({
	// TODO: Check author for bill
	get: privateProcedure
		.input(z.object({ fileName: z.string(), bucketName: BucketNameSchema }))
		.query(({ input, ctx: { supabase } }) => StorageController.downloadFile(supabase, input))
});
