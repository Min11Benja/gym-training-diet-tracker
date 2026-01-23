// Seed script to create demo coach and client users with sample data
// Run this once to populate the database with demo data

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDemoUsers = mutation({
    args: {},
    handler: async (ctx) => {
        // Check if demo users already exist
        const existingCoach = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), "coach@coachencontrol.com"))
            .first();

        if (existingCoach) {
            return { message: "Demo users already exist" };
        }

        // Create Coach User
        const coachId = await ctx.db.insert("users", {
            email: "coach@coachencontrol.com",
            name: "Demo Coach",
            role: "coach" as const,
        });

        // Create Client User (assigned to coach)
        const clientId = await ctx.db.insert("users", {
            email: "client@coachencontrol.com",
            name: "Demo Client",
            role: "client" as const,
            coachId: coachId,
            age: 28,
            sex: "male",
            height: 180, // cm
            goal: "muscle_gain" as const,
        });

        // Set Client's Nutrition Goals
        await ctx.db.insert("nutritionGoals", {
            userId: clientId,
            calories: 2800,
            protein: 180,
        });

        // Add some sample food logs for today
        const today = new Date().toISOString().split("T")[0];
        await ctx.db.insert("foodLogs", {
            userId: clientId,
            date: today,
            items: [
                {
                    food: "Chicken Breast",
                    quantity: "200g",
                    calories: 330,
                    protein: 62,
                },
                {
                    food: "Brown Rice",
                    quantity: "1 cup",
                    calories: 215,
                    protein: 5,
                },
                {
                    food: "Broccoli",
                    quantity: "150g",
                    calories: 50,
                    protein: 4,
                },
            ],
        });

        // Add sample workout for today
        await ctx.db.insert("workouts", {
            userId: clientId,
            date: today,
            status: "completed",
            exercises: [
                {
                    name: "Bench Press",
                    sets: 4,
                    reps: "8-10",
                    weight: 80,
                    effort: "medium" as const,
                    notes: "Felt strong today",
                },
                {
                    name: "Squats",
                    sets: 4,
                    reps: "6-8",
                    weight: 100,
                    effort: "hard" as const,
                },
                {
                    name: "Pull-ups",
                    sets: 3,
                    reps: "10",
                    weight: 0,
                    effort: "medium" as const,
                },
            ],
            notes: "Great session!",
        });

        // Add body metrics
        await ctx.db.insert("bodyMetrics", {
            userId: clientId,
            date: today,
            weight: 82,
            waist: 85,
        });

        // Add metrics for the last 7 days for trend
        for (let i = 1; i <= 7; i++) {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - i);
            await ctx.db.insert("bodyMetrics", {
                userId: clientId,
                date: pastDate.toISOString().split("T")[0],
                weight: 82 + (Math.random() - 0.5) * 0.5, // Small variations
                waist: 85,
            });
        }

        return {
            message: "Demo users created successfully",
            coachId,
            clientId,
        };
    },
});

// Helper mutation to clear demo data (for testing)
export const clearDemoUsers = mutation({
    args: {},
    handler: async (ctx) => {
        const coach = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), "coach@coachencontrol.com"))
            .first();

        const client = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), "client@coachencontrol.com"))
            .first();

        if (coach) await ctx.db.delete(coach._id);
        if (client) {
            // Delete all client data
            const goals = await ctx.db
                .query("nutritionGoals")
                .withIndex("by_user", (q) => q.eq("userId", client._id))
                .collect();
            for (const goal of goals) {
                await ctx.db.delete(goal._id);
            }

            const logs = await ctx.db
                .query("foodLogs")
                .filter((q) => q.eq(q.field("userId"), client._id))
                .collect();
            for (const log of logs) {
                await ctx.db.delete(log._id);
            }

            const workouts = await ctx.db
                .query("workouts")
                .filter((q) => q.eq(q.field("userId"), client._id))
                .collect();
            for (const workout of workouts) {
                await ctx.db.delete(workout._id);
            }

            const metrics = await ctx.db
                .query("bodyMetrics")
                .filter((q) => q.eq(q.field("userId"), client._id))
                .collect();
            for (const metric of metrics) {
                await ctx.db.delete(metric._id);
            }

            await ctx.db.delete(client._id);
        }

        return { message: "Demo data cleared" };
    },
});

// Clear ALL data (use with caution!)
export const clearAllData = mutation({
    args: {},
    handler: async (ctx) => {
        // Delete all tables in reverse dependency order
        const tables = [
            "foodLogs",
            "workouts",
            "bodyMetrics",
            "progress",
            "nutritionGoals",
            "aiMessages",
            "coachSettings",
            "clientActivity",
            "retentionMetrics",
            "users",
        ];

        let totalDeleted = 0;

        for (const tableName of tables) {
            const records = await ctx.db.query(tableName as any).collect();
            for (const record of records) {
                await ctx.db.delete(record._id);
                totalDeleted++;
            }
        }

        return {
            message: `Cleared all data: ${totalDeleted} records deleted`,
            deletedCount: totalDeleted,
        };
    },
});
