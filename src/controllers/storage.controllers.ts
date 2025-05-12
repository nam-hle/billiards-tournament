import { type BucketName } from "@/schemas";
import { type SupabaseInstance } from "@/services/supabase/server";

export namespace StorageController {
	export async function downloadFile(supabase: SupabaseInstance, payload: { fileName: string; bucketName: BucketName }) {
		const { data, error } = await supabase.storage.from(payload.bucketName).download(payload.fileName);

		if (error) {
			throw error;
		}

		const buffer = await data.arrayBuffer();

		return `data:${data.type};base64,${Buffer.from(buffer).toString("base64")}`;
	}
}
