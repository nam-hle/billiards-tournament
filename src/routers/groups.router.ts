import { z } from "zod";

import { GroupController } from "@/controllers";
import { MemberAction } from "@/controllers/member-transition";
import { router, privateProcedure, withSelectedGroup } from "@/services/trpc/server";
import {
	GroupSchema,
	UserMetaSchema,
	MembershipSchema,
	UserFinanceSchema,
	GroupDetailsSchema,
	MembershipStatusSchema,
	GroupDetailsWithBalanceSchema,
	MembershipChangeResponseSchema
} from "@/schemas";

export const groupsRouter = router({
	groups: privateProcedure
		.output(z.array(GroupDetailsSchema))
		.query(({ ctx: { user, supabase } }) => GroupController.getGroups(supabase, { userId: user.id })),
	groupsWithBalance: privateProcedure
		.output(z.array(GroupDetailsWithBalanceSchema))
		.query(({ ctx: { user, supabase } }) => GroupController.getGroupsWithBalance(supabase, { userId: user.id })),
	group: privateProcedure
		.input(z.object({ displayId: z.string() }))
		.output(GroupDetailsSchema)
		.query(({ input, ctx: { supabase } }) => GroupController.getGroupDetailsByDisplayId(supabase, input)),

	membersByGroupId: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(UserMetaSchema))
		.query(({ input, ctx: { supabase } }) => GroupController.getActiveMembers(supabase, input)),
	candidateMembers: privateProcedure
		.input(z.object({ groupId: z.string(), textSearch: z.string() }))
		.output(z.array(UserMetaSchema))
		.query(({ input, ctx: { supabase } }) => GroupController.getCandidateMembers(supabase, input)),
	members: privateProcedure
		.use(withSelectedGroup)
		.input(z.object({ excludeMe: z.boolean() }).optional())
		.output(z.array(UserMetaSchema))
		.query(({ input, ctx: { user, supabase } }) =>
			GroupController.getActiveMembers(supabase, { groupId: user.group.id, exclusions: input?.excludeMe ? [user.id] : [] })
		),
	memberBalances: privateProcedure
		.use(withSelectedGroup)
		.input(z.object({ excludeMe: z.boolean() }).optional())
		.output(z.array(UserFinanceSchema))
		.query(({ input, ctx: { user, supabase } }) =>
			GroupController.getUserFinances(supabase, { groupId: user.group.id, exclusions: input?.excludeMe ? [user.id] : [] })
		),

	update: privateProcedure
		.input(z.object({ name: z.string(), groupId: z.string() }))
		.mutation(({ input, ctx: { supabase } }) => GroupController.updateName(supabase, input)),
	create: privateProcedure
		.input(z.object({ name: z.string() }))
		.output(GroupSchema)
		.mutation(({ input, ctx: { user, supabase } }) => GroupController.create(supabase, { ...input, creatorId: user.id })),

	requests: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(MembershipSchema))
		.query(({ input, ctx: { supabase } }) =>
			GroupController.getMembershipsByStatus(supabase, { ...input, statuses: [MembershipStatusSchema.enum.Requesting] })
		),
	rejectRequest: privateProcedure
		.input(z.object({ requestId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.requestId, action: MemberAction.REJECT_REQUEST })
		),
	acceptRequest: privateProcedure
		.input(z.object({ requestId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.requestId, action: MemberAction.ACCEPT_REQUEST })
		),
	request: privateProcedure
		.input(z.object({ groupDisplayId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(async ({ input, ctx: { user, supabase } }) => {
			const group = await GroupController.findGroupByDisplayId(supabase, { displayId: input.groupDisplayId });

			if (!group) {
				return { ok: false, error: `Group ${input.groupDisplayId} does not exist` };
			}

			return GroupController.changeMembershipStatus(supabase, { userId: user.id, groupId: group?.id, action: MemberAction.REQUEST });
		}),

	invitations: privateProcedure
		.input(z.object({ groupId: z.string() }))
		.output(z.array(MembershipSchema))
		.query(({ input, ctx: { supabase } }) =>
			GroupController.getMembershipsByStatus(supabase, { ...input, statuses: [MembershipStatusSchema.enum.Inviting] })
		),
	acceptInvitation: privateProcedure
		.input(z.object({ invitationId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.invitationId, action: MemberAction.ACCEPT_INVITE })
		),
	rejectInvitation: privateProcedure
		.input(z.object({ invitationId: z.string() }))
		.output(MembershipChangeResponseSchema)
		.mutation(({ input, ctx: { supabase } }) =>
			GroupController.resolvePendingStatus(supabase, { membershipId: input.invitationId, action: MemberAction.REJECT_INVITE })
		),
	invite: privateProcedure
		.input(z.object({ groupId: z.string(), userIds: z.array(z.string()) }))
		.output(z.array(MembershipChangeResponseSchema))
		.mutation(({ input, ctx: { supabase } }) => {
			return Promise.all(
				input.userIds.map((userId) => {
					return GroupController.changeMembershipStatus(supabase, { ...input, userId, action: MemberAction.INVITE });
				})
			);
		})
});
