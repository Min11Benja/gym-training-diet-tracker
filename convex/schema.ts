import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.optional(v.string()),
        email: v.string(),
        role: v.optional(v.union(v.literal("coach"), v.literal("client"))),
        coachId: v.optional(v.id("users")), // ID of the coach if user is a client
        age: v.optional(v.number()),
        sex: v.optional(v.string()),
        height: v.optional(v.number()), // in cm
        goal: v.optional(v.union(v.literal("fat_loss"), v.literal("muscle_gain"), v.literal("recomp"))),
        photoUrl: v.optional(v.string()),
    }).index("by_email", ["email"]).index("by_coach", ["coachId"]),

    workouts: defineTable({
        userId: v.id("users"),
        date: v.string(), // ISO date YYYY-MM-DD
        status: v.optional(v.string()), // planned, completed
        exercises: v.array(
            v.object({
                name: v.string(),
                sets: v.number(),
                reps: v.string(), // string to allow "10-12" or "AMRAP"
                weight: v.number(),
                effort: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
                notes: v.optional(v.string()),
            })
        ),
        notes: v.optional(v.string()),
    }).index("by_user_date", ["userId", "date"]),

    nutritionGoals: defineTable({
        userId: v.id("users"),
        calories: v.number(),
        protein: v.number(), // in grams
    }).index("by_user", ["userId"]),

    foodLogs: defineTable({
        userId: v.id("users"),
        date: v.string(), // YYYY-MM-DD
        items: v.array(
            v.object({
                food: v.string(),
                quantity: v.string(), // e.g. "200g" or "1 cup"
                calories: v.number(),
                protein: v.number(),
            })
        ),
    }).index("by_user_date", ["userId", "date"]),

    bodyMetrics: defineTable({
        userId: v.id("users"),
        date: v.string(),
        weight: v.number(), // kg
        waist: v.optional(v.number()), // cm
    }).index("by_user_date", ["userId", "date"]),

    progress: defineTable({
        userId: v.id("users"),
        date: v.string(),
        photos: v.array(v.string()), // storage IDs or URLs
        notes: v.optional(v.string()),
    }).index("by_user_date", ["userId", "date"]),
});
