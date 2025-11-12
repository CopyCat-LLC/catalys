import { query } from "./_generated/server";
import { authComponent } from "./auth";
import { components } from "./_generated/api";

/**
 * Check if the current user has any organizations
 * Returns true if the user is a member of at least one organization
 */
export const hasOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    
    console.log("hasOrganizations - user:", { user: user ? { id: user._id, userId: user.userId } : null });
    
    if (!user) {
      console.log("hasOrganizations - No user found");
      return false;
    }

    const userIdToCheck = user.userId ?? user._id;
    console.log("hasOrganizations - Checking for userId:", userIdToCheck);

    // Query the Better Auth component's member table
    const membership = await ctx.runQuery(
      components.betterAuth.adapter.findOne,
      {
        model: "member",
        where: [
          {
            field: "userId",
            value: userIdToCheck,
          }
        ],
      }
    );

    console.log("hasOrganizations - Membership found:", membership !== null, membership);
    return membership !== null;
  },
});

/**
 * Get user's organization memberships count
 */
export const getUserOrganizationsCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    
    if (!user) {
      return 0;
    }

    // Query the Better Auth component's member table to count
    const memberships = await ctx.runQuery(
      components.betterAuth.adapter.findMany,
      {
        model: "member",
        where: [
          {
            field: "userId",
            value: user.userId ?? user._id,
          }
        ],
        paginationOpts: {
          cursor: null,
          numItems: 100,
        }
      }
    );

    return memberships?.page?.length ?? 0;
  },
});

