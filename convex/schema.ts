import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  userProfiles: defineTable({
    userId: v.string(), // Better Auth user ID
    userType: v.union(v.literal('FOUNDER'), v.literal('INVESTOR')),
  }).index('by_userId', ['userId']),
})
