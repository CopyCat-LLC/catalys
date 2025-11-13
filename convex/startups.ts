import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// Create a new startup with organization
export const create = mutation({
  args: {
    // Company info
    name: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    website: v.optional(v.string()),
    industry: v.string(),
    stage: v.union(
      v.literal('IDEA'),
      v.literal('MVP'),
      v.literal('LAUNCHED'),
      v.literal('GROWTH'),
      v.literal('SCALING')
    ),
    location: v.optional(v.string()),
    foundedDate: v.optional(v.string()),
    problemSolving: v.string(),
    targetMarket: v.string(),
    traction: v.optional(v.string()),
    fundingStage: v.optional(
      v.union(
        v.literal('PRE_SEED'),
        v.literal('SEED'),
        v.literal('SERIES_A'),
        v.literal('SERIES_B'),
        v.literal('SERIES_C_PLUS'),
        v.literal('BOOTSTRAPPED')
      )
    ),
    teamSize: v.optional(v.number()),
    coFounders: v.optional(v.array(v.object({
      name: v.optional(v.string()),
      email: v.string(),
      role: v.string(),
      equityPercentage: v.number(),
    }))), 
    
    organizationId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate slug from name
    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingStartup = await ctx.db
      .query('startups')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first()

    if (existingStartup) {
      throw new Error('A startup with this name already exists')
    }

    const now = Date.now()

    // Create the startup
    const startupId = await ctx.db.insert('startups', {
      organizationId: args.organizationId,
      name: args.name,
      slug,
      shortDescription: args.shortDescription,
      description: args.description,
      website: args.website,
      industry: args.industry,
      stage: args.stage,
      futureLocation: args.location || '',
      locationExplanation: '',
      howFarAlong: args.traction || '',
      workingTime: '',
      techStack: '',
      peopleUsing: false,
      versionTimeline: args.foundedDate,
      hasRevenue: false,
      whyThisIdea: args.problemSolving,
      customerNeed: args.targetMarket,
      competitors: '',
      monetization: '',
      category: args.industry,
      hasLegalEntity: false,
      legalEntities: '',
      equityBreakdown: '',
      investmentTaken: args.fundingStage ? args.fundingStage !== 'BOOTSTRAPPED' : false,
      currentlyFundraising: false,
      createdBy: args.userId,
      createdAt: now,
      updatedAt: now,
    })

    // Create co-founder records if provided
    if (args.coFounders && args.coFounders.length > 0) {
      for (const coFounder of args.coFounders) {
        await ctx.db.insert('coFounders', {
          startupId,
          organizationId: args.organizationId,
          email: coFounder.email,
          name: coFounder.name,
          role: coFounder.role,
          equityPercentage: coFounder.equityPercentage,
          invitationStatus: 'PENDING',
          invitedBy: args.userId,
          invitedAt: now,
        })
      }
    }

    // Mark user onboarding as completed
    const userProfile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first()

    if (userProfile) {
      await ctx.db.patch(userProfile._id, {
        onboardingCompleted: true,
      })
    }

    return { startupId, slug }
  },
})

// Get startup by organization ID
export const getByOrganizationId = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const startup = await ctx.db
      .query('startups')
      .withIndex('by_organizationId', (q) =>
        q.eq('organizationId', args.organizationId)
      )
      .first()

    return startup
  },
})

// Get startups for multiple organization IDs (for workspace selector)
export const getByOrganizationIds = query({
  args: { organizationIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const startups = await Promise.all(
      args.organizationIds.map(async (orgId) => {
        const startup = await ctx.db
          .query('startups')
          .withIndex('by_organizationId', (q) => q.eq('organizationId', orgId))
          .first()
        return startup
      })
    )

    return startups.filter((s) => s !== null)
  },
})

// Get startup by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const startup = await ctx.db
      .query('startups')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first()

    return startup
  },
})

// Update startup
export const update = mutation({
  args: {
    startupId: v.id('startups'),
    name: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    stage: v.optional(
      v.union(
        v.literal('IDEA'),
        v.literal('MVP'),
        v.literal('LAUNCHED'),
        v.literal('GROWTH'),
        v.literal('SCALING')
      )
    ),
    foundedDate: v.optional(v.string()),
    location: v.optional(v.string()),
    problemSolving: v.optional(v.string()),
    targetMarket: v.optional(v.string()),
    traction: v.optional(v.string()),
    fundingStage: v.optional(
      v.union(
        v.literal('PRE_SEED'),
        v.literal('SEED'),
        v.literal('SERIES_A'),
        v.literal('SERIES_B'),
        v.literal('SERIES_C_PLUS'),
        v.literal('BOOTSTRAPPED')
      )
    ),
    teamSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { startupId, ...updates } = args

    await ctx.db.patch(startupId, {
      ...updates,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})
