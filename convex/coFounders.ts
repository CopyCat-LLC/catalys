import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Create co-founder invitations
export const createBatch = mutation({
  args: {
    startupId: v.id('startups'),
    organizationId: v.string(),
    coFounders: v.array(
      v.object({
        name: v.optional(v.string()),
        email: v.string(),
        role: v.string(),
        equityPercentage: v.number(),
      })
    ),
    invitedBy: v.string(), // User ID
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const invitations = []

    for (const coFounder of args.coFounders) {
      const invitationId = await ctx.db.insert('coFounders', {
        startupId: args.startupId,
        organizationId: args.organizationId,
        name: coFounder.name,
        email: coFounder.email,
        role: coFounder.role,
        equityPercentage: coFounder.equityPercentage,
        invitationStatus: 'PENDING',
        invitedBy: args.invitedBy,
        invitedAt: now,
      })
      invitations.push(invitationId)
    }

    return { invitations }
  },
})

// Get co-founders for a startup
export const getByStartupId = query({
  args: { startupId: v.id('startups') },
  handler: async (ctx, args) => {
    const coFounders = await ctx.db
      .query('coFounders')
      .withIndex('by_startupId', (q) => q.eq('startupId', args.startupId))
      .collect()

    return coFounders
  },
})

// Get co-founders for an organization
export const getByOrganizationId = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const coFounders = await ctx.db
      .query('coFounders')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .collect()

    return coFounders
  },
})

// Accept co-founder invitation
export const acceptInvitation = mutation({
  args: {
    invitationId: v.id('coFounders'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invitationId, {
      invitationStatus: 'ACCEPTED',
      userId: args.userId,
      respondedAt: Date.now(),
    })

    return { success: true }
  },
})

// Decline co-founder invitation
export const declineInvitation = mutation({
  args: {
    invitationId: v.id('coFounders'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invitationId, {
      invitationStatus: 'DECLINED',
      respondedAt: Date.now(),
    })

    return { success: true }
  },
})

