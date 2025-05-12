import Image from "next/image";

import { AspectRatio } from "@/components/shadcn/aspect-ratio";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "@/components/shadcn/dialog";

namespace ImageDialog {
	export interface Props {
		readonly src: string;
	}
}

export const ImageDialog = ({ src }: ImageDialog.Props) => (
	<Dialog>
		<DialogTrigger asChild>
			<div className="cursor-pointer">
				<Image src={src} width={200} height={150} alt="Bill Receipt" className="h-[150px] rounded-md object-contain" />
			</div>
		</DialogTrigger>
		<DialogContent className="sm:max-w-[800px]">
			<DialogHeader className="hidden">
				<DialogTitle>Bill Receipt</DialogTitle>
				<DialogDescription>Bill receipt details</DialogDescription>
			</DialogHeader>
			<div className="relative">
				<AspectRatio ratio={16 / 9}>
					<Image fill src={src} alt="Bill Receipt" className="rounded-lg object-contain" />
				</AspectRatio>
			</div>
		</DialogContent>
	</Dialog>
);
