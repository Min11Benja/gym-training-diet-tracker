import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWorkouts = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        return await ctx.db
            .query("workouts")
            .withIndex("by_user_date", (q) => q.eq("userId", userId))
            .order("desc")
            .take(20);
    },
});

export const getWorkoutByDate = query({
    args: { date: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        return await ctx.db
            .query("workouts")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
            .first();
    }
});

export const logWorkout = mutation({
    args: {
        date: v.string(),
        exercises: v.array(
            v.object({
                name: v.string(),
                sets: v.number(),
                reps: v.string(),
                weight: v.number(),
                effort: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
                notes: v.optional(v.string())
            })
        ),
        notes: v.optional(v.string()),
        status: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        // Check if workout exists for date to update or insert
        const existing = await ctx.db
            .query("workouts")
            .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                exercises: args.exercises,
                notes: args.notes,
                status: args.status || "completed"
            });
        } else {
            await ctx.db.insert("workouts", {
                userId,
                date: args.date,
                exercises: args.exercises,
                notes: args.notes,
                status: args.status || "completed"
            });
        }
    },
});
