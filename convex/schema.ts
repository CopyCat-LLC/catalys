import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  userProfiles: defineTable({
    userId: v.string(), // Better Auth user ID
    userType: v.union(v.literal('FOUNDER'), v.literal('INVESTOR')),
    onboardingCompleted: v.optional(v.boolean()),
  }).index('by_userId', ['userId']),
  
  startups: defineTable({
    organizationId: v.string(), // Better Auth organization ID
    name: v.string(),
    slug: v.string(),
    shortDescription: v.string(), // One-liner pitch
    description: v.string(), // Detailed description
    website: v.optional(v.string()),
    industry: v.string(),
    stage: v.union(
      v.literal('IDEA'),
      v.literal('MVP'),
      v.literal('LAUNCHED'),
      v.literal('GROWTH'),
      v.literal('SCALING')
    ),
    foundedDate: v.optional(v.string()),
    location: v.optional(v.string()),
    problemSolving: v.string(), // What problem are you solving?
    targetMarket: v.string(), // Who is your target customer?
    traction: v.optional(v.string()), // Current metrics/traction
    fundingStage: v.optional(v.union(
      v.literal('PRE_SEED'),
      v.literal('SEED'),
      v.literal('SERIES_A'),
      v.literal('SERIES_B'),
      v.literal('SERIES_C_PLUS'),
      v.literal('BOOTSTRAPPED')
    )),
    teamSize: v.optional(v.number()),
    createdBy: v.string(), // User ID of creator
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_organizationId', ['organizationId'])
    .index('by_slug', ['slug'])
    .index('by_createdBy', ['createdBy']),
    
  coFounders: defineTable({
    startupId: v.id('startups'),
    organizationId: v.string(), // Better Auth organization ID
    email: v.string(),
    name: v.optional(v.string()),
    role: v.string(), // e.g., "Co-Founder & CTO", "Co-Founder & CEO"
    equityPercentage: v.number(), // 0-100
    invitationStatus: v.union(
      v.literal('PENDING'),
      v.literal('ACCEPTED'),
      v.literal('DECLINED')
    ),
    invitedBy: v.string(), // User ID
    userId: v.optional(v.string()), // Set when they accept
    invitedAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index('by_startupId', ['startupId'])
    .index('by_email', ['email'])
    .index('by_organizationId', ['organizationId']),
})
