import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  userProfiles: defineTable({
    userId: v.string(), // Better Auth user ID
    userType: v.union(v.literal('FOUNDER'), v.literal('INVESTOR')),
  }).index('by_userId', ['userId']),
})
