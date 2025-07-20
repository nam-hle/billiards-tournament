import { assert } from "@/utils";
import { type Group } from "@/interfaces";
import { BaseRepository } from "@/repositories/base.repository";

export class GroupRepository extends BaseRepository {
	async find(params: { year: string; groupId: string }): Promise<Group | undefined> {
		const groups = await this.dataSource.getGroups({ year: params.year });

		return groups.find((group) => group.id === params.groupId);
	}

	async get(params: { year: string; groupId: string }): Promise<Group> {
		const group = await this.find(params);

		assert(group, `Group with ID ${params.groupId} not found for year ${params.year}`);

		return group;
	}
}
