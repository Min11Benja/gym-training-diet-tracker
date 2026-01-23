import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all clients for a coach
export const getClients = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const coach = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();

        if (!coach || coach.role !== "coach") return [];

        return await ctx.db
            .query("users")
            .withIndex("by_coach", (q) => q.eq("coachId", coach._id))
            .collect();
    },
});

// Get a specific client's details
export const getClientDetails = query({
    args: { clientId: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const coach = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();

        if (!coach || coach.role !== "coach") return null;

        const client = await ctx.db.get(args.clientId);
        if (!client || client.coachId !== coach._id) return null;

        // Get client's active workout plan
        const workoutPlan = await ctx.db
            .query("workoutPlans")
            .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
            .filter((q) => q.eq(q.field("status"), "active"))
            .first();

        // Get recent workouts
        const recentWorkouts = await ctx.db
            .query("workouts")
            .filter((q) => q.eq(q.field("userId"), args.clientId))
            .order("desc")
            .take(10);

        // Get latest metrics
        const latestMetrics = await ctx.db
            .query("bodyMetrics")
            .filter((q) => q.eq(q.field("userId"), args.clientId))
            .order("desc")
            .first();

        return {
            ...client,
            workoutPlan,
            recentWorkouts,
            latestMetrics,
        };
    },
});

// Assign workout plan to client
export const assignWorkoutPlan = mutation({
    args: {
        clientId: v.id("users"),
        name: v.string(),
        description: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        weeklyPlan: v.array(
            v.object({
                dayOfWeek: v.number(),
                dayName: v.string(),
                exercises: v.array(
                    v.object({
                        name: v.string(),
                        sets: v.number(),
                        reps: v.string(),
                        weight: v.optional(v.number()),
                        notes: v.optional(v.string()),
                    })
                ),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const coach = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();

        if (!coach || coach.role !== "coach") throw new Error("Not authorized");

        // Verify client belongs to this coach
        const client = await ctx.db.get(args.clientId);
        if (!client || client.coachId !== coach._id) {
            throw new Error("Client not found or not assigned to you");
        }

        // Deactivate any existing active plans
        const existingPlans = await ctx.db
            .query("workoutPlans")
            .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect();

        for (const plan of existingPlans) {
            await ctx.db.patch(plan._id, { status: "paused" });
        }

        // Create new plan
        const planId = await ctx.db.insert("workoutPlans", {
            coachId: coach._id,
            clientId: args.clientId,
            name: args.name,
            description: args.description,
            startDate: args.startDate,
            endDate: args.endDate,
            status: "active",
            weeklyPlan: args.weeklyPlan,
        });

        return { planId, success: true };
    },
});

// Get client's active workout plan
export const getActiveWorkoutPlan = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();

        if (!user) return null;

        return await ctx.db
            .query("workoutPlans")
            .withIndex("by_client", (q) => q.eq("clientId", user._id))
            .filter((q) => q.eq(q.field("status"), "active"))
            .first();
    },
});

// Get today's workout from plan
export const getTodaysWorkout = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .first();

        if (!user) return null;

        const plan = await ctx.db
            .query("workoutPlans")
            .withIndex("by_client", (q) => q.eq("clientId", user._id))
            .filter((q) => q.eq(q.field("status"), "active"))
            .first();

        if (!plan) return null;

        // Get current day of week (0 = Monday)
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

        const todaysWorkout = plan.weeklyPlan.find((w) => w.dayOfWeek === dayOfWeek);

        if (!todaysWorkout) return null;

        // Check if already logged today
        const todayStr = today.toISOString().split("T")[0];
        const existing = await ctx.db
            .query("workouts")
            .withIndex("by_user_date", (q) =>
                q.eq("userId", user._id).eq("date", todayStr)
            )
            .first();

        return {
            plan,
            todaysWorkout,
            alreadyLogged: !!existing,
            existingWorkout: existing,
        };
    },
});

// Mark workout as complete
export const markWorkoutComplete = mutation({
    args: {
        workoutId: v.id("workouts"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const workout = await ctx.db.get(args.workoutId);
        if (!workout) throw new Error("Workout not found");

        await ctx.db.patch(args.workoutId, {
            status: "completed",
            completedAt: Date.now(),
        });

        return { success: true };
    },
});
