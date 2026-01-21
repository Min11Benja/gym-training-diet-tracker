import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

export const updateProfile = mutation({
    args: {
        role: v.union(v.literal("coach"), v.literal("client")),
        height: v.optional(v.number()),
        goal: v.optional(v.union(v.literal("fat_loss"), v.literal("muscle_gain"), v.literal("recomp"))),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        await ctx.db.patch(userId, {
            role: args.role,
            height: args.height,
            goal: args.goal,
        });
    },
});
