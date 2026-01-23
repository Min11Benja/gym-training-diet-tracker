import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getWorkouts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("workouts")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .take(100);
  },
});

export const logWorkout = mutation({
  args: {
    date: v.string(),
    status: v.string(),
    exercises: v.array(
      v.object({
        name: v.string(),
        sets: v.number(),
        reps: v.union(
          v.string(),
          v.object({ left: v.number(), right: v.number() }),
        ),
        weight: v.optional(v.number()),
        effort: v.optional(
          v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
        ),
        notes: v.optional(v.string()),
      }),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        exercises: args.exercises,
        notes: args.notes,
        status: args.status,
        completedAt: Date.now(),
      });
      return { success: true, updated: true };
    }

    await ctx.db.insert("workouts", {
      userId: user._id,
      ...args,
      completedAt: Date.now(),
    });

    return { success: true, created: true };
  },
});

// Import workouts from parsed text
export const importWorkouts = mutation({
  args: {
    workouts: v.array(
      v.object({
        date: v.string(),
        warmup: v.array(v.string()),
        exercises: v.array(
          v.object({
            name: v.string(),
            sets: v.array(
              v.object({
                weight: v.optional(v.number()),
                reps: v.union(
                  v.number(),
                  v.object({ left: v.number(), right: v.number() }),
                ),
                notes: v.optional(v.string()),
              }),
            ),
          }),
        ),
        rawText: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) throw new Error("User not found");

    let imported = 0;

    for (const workout of args.workouts) {
      // Check if workout already exists for this date
      const existing = await ctx.db
        .query("workouts")
        .withIndex("by_user_date", (q) =>
          q.eq("userId", user._id).eq("date", workout.date),
        )
        .first();

      if (existing) {
        console.log(`Skipping duplicate workout for ${workout.date}`);
        continue;
      }

      // Convert sets array to the schema format
      const exercises = workout.exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets.length,
        reps:
          exercise.sets.length > 0
            ? typeof exercise.sets[0].reps === "number"
              ? exercise.sets[0].reps.toString()
              : exercise.sets[0].reps
            : "0",
        weight: exercise.sets[0]?.weight,
        notes:
          exercise.sets
            .map((s) => s.notes)
            .filter(Boolean)
            .join(", ") || undefined,
      }));

      await ctx.db.insert("workouts", {
        userId: user._id,
        date: workout.date,
        status: "completed",
        exercises,
        warmup: workout.warmup.length > 0 ? workout.warmup : undefined,
        rawText: workout.rawText,
        isImported: true,
      });

      imported++;
    }

    return {
      success: true,
      imported,
      total: args.workouts.length,
    };
  },
});

// Get imported workouts for review
export const getImportedWorkouts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("workouts")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("isImported"), true),
        ),
      )
      .order("desc")
      .take(50);
  },
});

// Get a single workout by date for the current user
export const getWorkoutByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) return null;

    return await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date),
      )
      .first();
  },
});
