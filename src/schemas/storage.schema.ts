import { z } from "zod";

export const BucketNameSchema = z.union([z.literal("avatars"), z.literal("receipts")]);
export type BucketName = z.infer<typeof BucketNameSchema>;
