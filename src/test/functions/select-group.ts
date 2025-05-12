import { type UserName, type GroupName } from "@/test/utils";
import { type BasicPreset } from "@/test/functions/seed-basic-preset";

export async function selectGroup(preset: BasicPreset, options?: Partial<Record<UserName, GroupName | null>>) {
	if (options === undefined) {
		await Promise.all(Object.values(preset.requesters).map((requester) => requester.user.selectGroup.mutate({ groupId: preset.groups.Hogwarts.id })));

		return;
	}

	for (const [_username, groupName] of Object.entries(options)) {
		await preset.requesters[_username as UserName].user.selectGroup.mutate({ groupId: groupName === null ? null : preset.groups[groupName].id });
	}
}
