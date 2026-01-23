import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;

    // If user exists but is missing details (likely newly created via auth),
    // check if there's another record with the same email that has details.
    // This handles merging profiles created by coaches.
    if (!user.role || !user.coachId) {
      const profile = await ctx.db
        .query("users")
        .filter((q) =>
          q.and(
            q.eq(q.field("email"), user.email),
            q.neq(q.field("_id"), userId),
          ),
        )
        .first();

      if (profile) {
        // Return merged view or hint that we should merge
        return { ...user, ...profile, _id: userId, hasLegacyProfile: true };
      }
    }

    return user;
  },
});

export const mergeProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const profile = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), user.email),
          q.neq(q.field("_id"), userId),
        ),
      )
      .first();

    if (profile) {
      // Copy data over
      await ctx.db.patch(userId, {
        name: profile.name,
        role: profile.role,
        coachId: profile.coachId,
        age: profile.age,
        sex: profile.sex,
        height: profile.height,
        goal: profile.goal,
        phone: profile.phone,
        photoUrl: profile.photoUrl,
      });

      // Re-link workouts
      const workouts = await ctx.db
        .query("workouts")
        .withIndex("by_user_date", (q) => q.eq("userId", profile._id))
        .collect();
      for (const w of workouts) {
        await ctx.db.patch(w._id, { userId });
      }

      // Re-link metrics
      const metrics = await ctx.db
        .query("bodyMetrics")
        .withIndex("by_user_date", (q) => q.eq("userId", profile._id))
        .collect();
      for (const m of metrics) {
        await ctx.db.patch(m._id, { userId });
      }

      // Delete legacy profile
      await ctx.db.delete(profile._id);
      return { success: true };
    }
    return { success: false, message: "No legacy profile found" };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    role: v.union(v.literal("coach"), v.literal("client")),
    age: v.optional(v.number()),
    sex: v.optional(v.string()),
    height: v.number(),
    goal: v.optional(
      v.union(
        v.literal("fat_loss"),
        v.literal("muscle_gain"),
        v.literal("recomp"),
      ),
    ),
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
    goal: v.optional(
      v.union(
        v.literal("fat_loss"),
        v.literal("muscle_gain"),
        v.literal("recomp"),
      ),
    ),
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
