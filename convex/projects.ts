import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        name: v.string(),
        tagline: v.optional(v.string()),
        url: v.string(),
        visitorId: v.string(),
        stackId: v.id("stacks"),
    },
    handler: async (ctx, args) => {
        // Generate a simple slug
        const baseSlug = args.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        // Ensure uniqueness by appending a random string if needed
        // For MVP, we'll append a short random string to avoid collisions
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        const slug = `${baseSlug}-${randomSuffix}`;

        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            slug,
            tagline: args.tagline,
            url: args.url,
            visitorId: args.visitorId,
            stackId: args.stackId,
            upvotes: 0,
            createdAt: Date.now(),
        });

        return { projectId, slug };
    },
});

export const getTodayLaunch = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        // Get top projects by upvotes (for MVP, just top overall or recent)
        // We could filter by createdAt for "today", but let's just get top recent projects
        const projects = await ctx.db
            .query("projects")
            .withIndex("by_upvotes")
            .order("desc")
            .take(args.limit ?? 10);

        // Hydrate projects with stack and tools
        return await Promise.all(
            projects.map(async (project) => {
                const stack = await ctx.db.get(project.stackId);
                // Get user's vote state
                // For query, we'll return whether the visitor has voted elsewhere or omit it

                return {
                    ...project,
                    stack,
                };
            })
        );
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const project = await ctx.db
            .query("projects")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!project) return null;

        const stack = await ctx.db.get(project.stackId);

        return {
            ...project,
            stack,
        };
    },
});

export const toggleVote = mutation({
    args: {
        projectId: v.id("projects"),
        visitorId: v.string(),
    },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.projectId);
        if (!project) throw new Error("Project not found");

        const existingVote = await ctx.db
            .query("projectVotes")
            .withIndex("by_project_visitor", (q) =>
                q.eq("projectId", args.projectId).eq("visitorId", args.visitorId)
            )
            .first();

        if (existingVote) {
            // Remove vote
            await ctx.db.delete(existingVote._id);
            await ctx.db.patch(args.projectId, { upvotes: project.upvotes - 1 });
            return { voted: false, upvotes: project.upvotes - 1 };
        } else {
            // Add vote
            await ctx.db.insert("projectVotes", {
                projectId: args.projectId,
                visitorId: args.visitorId,
                createdAt: Date.now(),
            });
            await ctx.db.patch(args.projectId, { upvotes: project.upvotes + 1 });
            return { voted: true, upvotes: project.upvotes + 1 };
        }
    },
});

export const getVoteStatus = query({
    args: {
        projectId: v.id("projects"),
        visitorId: v.string(),
    },
    handler: async (ctx, args) => {
        if (!args.visitorId) return false;

        const existingVote = await ctx.db
            .query("projectVotes")
            .withIndex("by_project_visitor", (q) =>
                q.eq("projectId", args.projectId).eq("visitorId", args.visitorId)
            )
            .first();

        return !!existingVote;
    },
});

export const getByStackId = query({
    args: { stackId: v.id("stacks") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("projects")
            .withIndex("by_stack", (q) => q.eq("stackId", args.stackId))
            .collect();
    },
});
