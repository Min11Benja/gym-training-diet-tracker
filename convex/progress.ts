import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
});

export const saveProgress = mutation({
    args: {
        storageId: v.string(),
        date: v.string(),
        notes: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.insert("progress", {
            userId,
            date: args.date,
            photos: [args.storageId],
            notes: args.notes
        });
    },
});

export const getProgress = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const entries = await ctx.db
            .query("progress")
            .withIndex("by_user_date", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        // Map storageId to URL
        return await Promise.all(entries.map(async (entry) => ({
            ...entry,
            photos: await Promise.all(entry.photos.map(id => ctx.storage.getUrl(id)))
        })));
    },
});
