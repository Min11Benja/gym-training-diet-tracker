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
        name: v.string(),
        role: v.union(v.literal("coach"), v.literal("client")),
        age: v.optional(v.number()),
        sex: v.optional(v.string()),
        height: v.number(),
        goal: v.optional(v.union(v.literal("fat_loss"), v.literal("muscle_gain"), v.literal("recomp"))),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        await ctx.db.patch(userId, {
            name: args.name,
            role: args.role,
            age: args.age,
            sex: args.sex,
            height: args.height,
            goal: args.goal,
        });

        return { success: true };
    },
});
