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

export const createClient = mutation({
    args: {
        email: v.string(),
        name: v.string(),
        age: v.optional(v.number()),
        sex: v.optional(v.string()),
        height: v.optional(v.number()),
        goal: v.optional(v.union(v.literal("fat_loss"), v.literal("muscle_gain"), v.literal("recomp"))),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        console.log("createClient mutation - checking auth userId:", userId);
        if (!userId) throw new Error("Not authenticated");

        const coach = await ctx.db.get(userId);
        if (!coach) throw new Error("User record not found");

        // Auto-assign coach role for demo coach if newly created through auth
        if (coach.email === "coach@coachencontrol.com" && coach.role !== "coach") {
            await ctx.db.patch(userId, { role: "coach" });
            coach.role = "coach";
        }

        if (coach.role !== "coach") throw new Error("Only coaches can add clients");

        // Check if user with this email already exists
        const existing = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (existing) throw new Error("A user with this email already exists");

        const clientId = await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            role: "client",
            coachId: userId,
            age: args.age,
            sex: args.sex,
            height: args.height || 170,
            goal: args.goal,
            phone: args.phone,
        });

        return { clientId, success: true };
    },
});
