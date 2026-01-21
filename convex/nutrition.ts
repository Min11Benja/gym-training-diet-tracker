import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getNutrition = query({
    args: { date: v.string() }, // YYYY-MM-DD
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const goals = await ctx.db
            .query("nutritionGoals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        const logs = await ctx.db
            .query("foodLogs")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
            .first();

        return {
            goals: goals || { calories: 2500, protein: 150 }, // default
            logs: logs?.items || []
        };
    },
});

export const saveGoals = mutation({
    args: { calories: v.number(), protein: v.number() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("nutritionGoals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, args);
        } else {
            await ctx.db.insert("nutritionGoals", { userId, ...args });
        }
    }
});

export const logFood = mutation({
    args: {
        date: v.string(),
        item: v.object({
            food: v.string(),
            quantity: v.string(),
            calories: v.number(),
            protein: v.number()
        })
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("foodLogs")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                items: [...existing.items, args.item]
            });
        } else {
            await ctx.db.insert("foodLogs", {
                userId,
                date: args.date,
                items: [args.item]
            });
        }
    }
});
