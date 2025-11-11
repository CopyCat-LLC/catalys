import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Create a user profile
 */
export const create = mutation({
  args: {
    userId: v.string(),
    userType: v.union(v.literal('FOUNDER'), v.literal('INVESTOR')),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();
    
    if (existing) {
      throw new Error('User profile already exists');
    }

    // Create the profile
    const profileId = await ctx.db.insert('userProfiles', {
      userId: args.userId,
      userType: args.userType,
    });

    return profileId;
  },
});

/**
 * Get a user profile by user ID
 */
export const getByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    return profile;
  },
});

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    
    if (!user) {
      return null;
    }

    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', user.userId ?? user._id))
      .first();

    return profile;
  },
});

/**
 * Update user profile
 */
export const update = mutation({
  args: {
    userId: v.string(),
    userType: v.union(v.literal('FOUNDER'), v.literal('INVESTOR')),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('userProfiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!profile) {
      throw new Error('User profile not found');
    }

    await ctx.db.patch(profile._id, {
      userType: args.userType,
    });

    return profile._id;
  },
});

