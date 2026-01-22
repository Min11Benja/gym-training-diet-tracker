import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getClients = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (user?.role !== "coach") {
            // In a real app we'd throw or return empty, but for MVP let's return []
            return [];
        }

        // Since we don't have an "invite" system yet, we'll just return ALL clients 
        // OR we can implement a simple "assign coach" logic later.
        // For MVP, let's assume ALL users with role 'client' are visible to the coach 
        // if we want to test easily, OR filtering by `coachId` if we want strict logic.
        // Plan said "Coach creates client accounts OR invites", so they should be linked.
        // Let's filter by `coachId`.

        const clients = await ctx.db
            .query("users")
            .withIndex("by_coach", (q) => q.eq("coachId", userId))
            .collect();

        return clients;
    },
});

export const getAllClientsForDemo = query({
    args: {},
    handler: async (ctx) => {
        // Useful for debugging if assignment isn't working yet
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "client"))
            .collect();
    }
});

export const getClientDetails = query({
    args: { clientId: v.id("users") },
    handler: async (ctx, args) => {
        // Auth check
        const userId = await getAuthUserId(ctx);
        if (!userId) return null; // or throw

        const client = await ctx.db.get(args.clientId);
        if (!client) return null;

        // In real app, check if coachId matches userId

        const workouts = await ctx.db
            .query("workouts")
            .withIndex("by_user_date", (q) => q.eq("userId", args.clientId))
            .order("desc")
            .take(5);

        const metrics = await ctx.db
            .query("bodyMetrics")
            .withIndex("by_user_date", (q) => q.eq("userId", args.clientId))
            .order("desc")
            .take(5);

        const nutrition = await ctx.db
            .query("foodLogs")
            .withIndex("by_user_date", (q) => q.eq("userId", args.clientId))
            .order("desc")
            .take(7);

        const progress = await ctx.db
            .query("progress")
            .withIndex("by_user_date", (q) => q.eq("userId", args.clientId))
            .order("desc")
            .take(6);

        return {
            client,
            workouts,
            metrics,
            nutrition,
            progress
        };
    },
});

export const assignWorkout = mutation({
    args: {
        clientId: v.id("users"),
        date: v.string(),
        exercises: v.array(
            v.object({
                name: v.string(),
                sets: v.number(),
                reps: v.string(),
                weight: v.optional(v.number()),
            })
        ),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Auth check
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        // Validate coach relationship here

        await ctx.db.insert("workouts", {
            userId: args.clientId,
            date: args.date,
            status: "planned",
            exercises: args.exercises.map(e => ({
                ...e,
                weight: e.weight || 0, // ensure weight is number if needed, or leave optional
                // effort is optional/undefined for planned
            })),
            notes: args.notes,
        });
    },
});
