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
                reps: v.union(
                    v.string(), // e.g. "8-10" or "12"
                    v.object({ left: v.number(), right: v.number() }) // bilateral: { left: 9, right: 8 }
                ),
                weight: v.optional(v.number()), // in kg, optional for bodyweight
                effort: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
                notes: v.optional(v.string()),
            })
        ),
        notes: v.optional(v.string()),
        // Import-specific fields
        isImported: v.optional(v.boolean()), // true if from import tool
        rawText: v.optional(v.string()), // original pasted text
        warmup: v.optional(v.array(v.string())), // warmup notes
        // Coach assignment fields
        assignedBy: v.optional(v.id("users")), // Coach who assigned this
        planId: v.optional(v.id("workoutPlans")), // If part of a plan
        completedAt: v.optional(v.number()), // Timestamp when marked complete
    }).index("by_user_date", ["userId", "date"]),

    // Workout Plans (assigned by coach to client)
    workoutPlans: defineTable({
        coachId: v.id("users"),
        clientId: v.id("users"),
        name: v.string(),
        description: v.optional(v.string()),
        startDate: v.string(), // YYYY-MM-DD
        endDate: v.optional(v.string()), // YYYY-MM-DD
        status: v.union(v.literal("active"), v.literal("completed"), v.literal("paused")),
        // Weekly workout template
        weeklyPlan: v.array(
            v.object({
                dayOfWeek: v.number(), // 0 = Monday, 6 = Sunday
                dayName: v.string(), // "Monday", "Tuesday", etc.
                exercises: v.array(
                    v.object({ name: v.string(), sets: v.number(), reps: v.string(), weight: v.optional(v.number()), notes: v.optional(v.string()) })
                ),
            })
        ),
    })
        .index("by_client", ["clientId"])
        .index("by_coach", ["coachId"]),

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

    // AI Message System - for coach approval workflow
    aiMessages: defineTable({
        clientId: v.id("users"),
        coachId: v.id("users"),
        trigger: v.string(), // "off_plan_meal", "missed_workout", "week_salvage", etc.
        draftMessage: v.string(),
        status: v.union(v.literal("draft"), v.literal("approved"), v.literal("sent"), v.literal("rejected")),
        sentAt: v.optional(v.number()), // timestamp
        createdAt: v.number(), // timestamp for sorting
    })
        .index("by_coach_status", ["coachId", "status"])
        .index("by_client", ["clientId"])
        .index("by_created", ["createdAt"]),

    // Coach Settings - AI tone customization
    coachSettings: defineTable({
        coachId: v.id("users"),
        aiTone: v.optional(v.union(v.literal("firm"), v.literal("supportive"), v.literal("casual"))),
        autoApprove: v.optional(v.boolean()), // default false
        customTemplates: v.optional(v.string()), // JSON string of custom response templates
    }).index("by_coach", ["coachId"]),

    // Client Activity Tracking - for risk score calculation
    clientActivity: defineTable({
        clientId: v.id("users"),
        weekOf: v.string(), // ISO week (YYYY-Www)
        mealsLogged: v.number(),
        workoutsCompleted: v.number(),
        checkInsCount: v.number(), // total interactions with app
        riskScore: v.number(), // 0-100 (0=engaged, 100=at risk)
    })
        .index("by_client_week", ["clientId", "weekOf"])
        .index("by_risk", ["riskScore"]),

    // Retention Metrics - coach-facing analytics
    retentionMetrics: defineTable({
        coachId: v.id("users"),
        weekOf: v.string(), // ISO week
        clientsActive: v.number(),
        clientsAtRisk: v.number(),
        dropouts: v.number(),
        avgLTV: v.optional(v.number()), // average client lifetime value in months
    })
        .index("by_coach_week", ["coachId", "weekOf"]),
});
