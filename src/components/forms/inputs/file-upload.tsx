"use client";

import * as React from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Trash2, UploadCloud } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";

import { Show } from "@/components/mics/show";

import { cn } from "@/utils/cn";
import { trpc } from "@/services";
import { generateUid } from "@/utils";
import { type BucketName } from "@/schemas";
import { createSupabaseClient } from "@/services/supabase/client";

namespace FileUpload {
	export interface Props {
		readonly fileId?: string;
		readonly ownerId?: string;
		readonly editing?: boolean;
		readonly loading?: boolean;
		readonly bucketName: BucketName;
		readonly buttonSize: "md" | "sm";
		onChange: (fileId: string | null) => void;
		imageRenderer: (src: string) => React.ReactNode;
	}
}
export const FileUpload = ({ fileId, loading, ownerId, editing, onChange, buttonSize, bucketName, imageRenderer }: FileUpload.Props) => {
	const { data: url, isLoading: loadingImage } = trpc.storage.get.useQuery({ bucketName, fileName: fileId || "" }, { enabled: !!fileId });
	const [, setPreviewUrl] = React.useState<string | null>(null);

	const { uploadFile } = useFileUploader(onChange);

	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				// TODO: Only upload when saving/creating
				uploadFile({ file, ownerId, bucketName });

				const reader = new FileReader();
				reader.onload = (e) => {
					setPreviewUrl(e.target?.result as string);
				};

				reader.readAsDataURL(file);
			}
		},
		[bucketName, ownerId, uploadFile]
	);

	const { getRootProps, isDragActive, getInputProps } = useDropzone({
		onDrop,
		multiple: false,
		accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif"] }
	});

	const removeFile = () => {
		onChange(null);
		setPreviewUrl(null);
	};

	const renderEmptyState = () => {
		return (
			<div className="flex flex-col items-center justify-center text-muted-foreground">
				<div className="text-center">
					<p>No uploaded receipt yet</p>
				</div>
			</div>
		);
	};

	const renderEditButtons = () => {
		if (!editing) {
			return null;
		}

		return (
			<div className="absolute bottom-0 right-0 flex flex-col justify-between">
				<Button size="icon" type="button" onClick={removeFile} variant="destructive" className={buttonSize === "sm" ? "h-8 w-8" : ""}>
					<Trash2 />
				</Button>
			</div>
		);
	};

	const renderUploadArea = () => {
		return (
			<div
				{...getRootProps()}
				className={cn(
					"flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
					isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
				)}>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center justify-center text-muted-foreground">
					<UploadCloud className="mb-2 h-8 w-8" />
					<div className="text-center">
						<p>Drag & drop an image here, or click to select one</p>
					</div>
				</div>
			</div>
		);
	};

	const renderImagePreview = () => {
		return (
			<Show when={url} fallback={<Skeleton className="h-full w-full" />}>
				{(loadedUrl) => (
					<div className="relative inline-block">
						{imageRenderer(loadedUrl)}
						{renderEditButtons()}
					</div>
				)}
			</Show>
		);
	};

	if (loading || loadingImage || fileId) {
		return renderImagePreview();
	}

	if (editing) {
		return renderUploadArea();
	}

	return renderEmptyState();
};

function useFileUploader(onSuccess: (filePath: string) => void) {
	const { mutate, isPending } = useMutation({
		mutationFn: uploadFile,
		onError: () => {
			toast.error("Failed to upload avatar");
		},
		onSuccess: (filePath) => {
			toast.success("Image uploaded", { description: "The image has been uploaded successfully." });
			onSuccess(filePath);
		}
	});

	return React.useMemo(() => ({ uploadFile: mutate, isUploading: isPending }), [isPending, mutate]);
}

interface UploadImagePayload {
	readonly file: File;
	readonly ownerId?: string;
	readonly bucketName: BucketName;
}

async function uploadFile(payload: UploadImagePayload) {
	const { file, ownerId, bucketName } = payload;
	const extension = file.name.split(".").pop();
	const filePath = [ownerId, generateUid()].filter(Boolean).join("-") + `.${extension}`;
	const { error: uploadError } = await createSupabaseClient().storage.from(bucketName).upload(filePath, file);

	if (uploadError) {
		throw uploadError;
	}

	return filePath;
}
