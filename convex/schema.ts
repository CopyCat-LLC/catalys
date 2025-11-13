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
    shortDescription: v.string(), // 50 characters max
    description: v.string(), // What is your company going to make?
    website: v.optional(v.string()),
    demoVideo: v.optional(v.string()),
    futureLocation: v.string(),
    locationExplanation: v.string(),
    
    // Progress
    howFarAlong: v.string(),
    workingTime: v.string(),
    techStack: v.string(),
    peopleUsing: v.boolean(),
    versionTimeline: v.optional(v.string()),
    hasRevenue: v.boolean(),
    appliedBefore: v.union(
      v.literal('first_time'),
      v.literal('same_idea'),
      v.literal('different_idea')
    ),
    previousApplicationNotes: v.optional(v.string()),
    incubatorInfo: v.optional(v.string()),
    
    // Idea
    whyThisIdea: v.string(),
    customerNeed: v.string(),
    competitors: v.string(),
    monetization: v.string(),
    category: v.string(),
    
    // Equity
    hasLegalEntity: v.boolean(),
    legalEntities: v.optional(v.string()),
    equityBreakdown: v.optional(v.string()),
    investmentTaken: v.boolean(),
    currentlyFundraising: v.boolean(),
    
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
