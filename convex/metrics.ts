import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const logMetrics = mutation({
    args: {
        date: v.string(),
        weight: v.number(),
        waist: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("bodyMetrics")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, args);
        } else {
            await ctx.db.insert("bodyMetrics", { userId, ...args });
        }
    },
});

export const getMetrics = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        return await ctx.db
            .query("bodyMetrics")
            .withIndex("by_user_date", (q) => q.eq("userId", userId))
            .order("desc")
            .take(30); // Last 30 entries
    }
});
