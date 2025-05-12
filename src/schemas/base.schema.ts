import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

export const JsonSchema: z.ZodType<Json> = z.lazy(() => z.union([literalSchema, z.array(JsonSchema), z.record(JsonSchema)]));

export const TrpcResponseSchema = z.union([z.object({ ok: z.literal(true) }), z.object({ error: z.string(), ok: z.literal(false) })]);

export type TrpcResponse = z.infer<typeof TrpcResponseSchema>;

export const DataListResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
	z.object({
		data: z.array(itemSchema),
		fullSize: z.number().int().nonnegative()
	});
