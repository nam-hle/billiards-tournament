import { toast } from "sonner";

import { trpc } from "@/services";

export function useSwitchGroup() {
	const utils = trpc.useUtils();

	return trpc.user.selectGroup.useMutation({
		onSuccess: () => {
			utils.invalidate().then(() => {
				toast.success("You have successfully changed the group");
				window.location.reload();
			});
		}
	});
}
