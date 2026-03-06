import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  domains: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    order: v.number(),
  }).index("by_slug", ["slug"]),

  filterNodes: defineTable({
    label: v.string(),
    slug: v.string(),
    parentId: v.optional(v.id("filterNodes")),
    domainId: v.id("domains"),
    order: v.number(),
  })
    .index("by_domain", ["domainId"])
    .index("by_parent", ["parentId"])
    .index("by_slug", ["slug"]),

  tools: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.string(),
    type: v.union(v.literal("tool"), v.literal("saas"), v.literal("course"), v.literal("resource")),
    baselineScore: v.number(),
    pros: v.array(v.string()),
    cons: v.array(v.string()),
    isHot: v.boolean(),
    isTrending: v.boolean(),
    courseUrl: v.optional(v.string()),
    provider: v.optional(v.string()),
    isFree: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    searchText: v.optional(v.string()),
    primaryCategory: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    lastRelease: v.optional(v.string()),
    lastReleaseDate: v.optional(v.number()),
    lastCommitDate: v.optional(v.number()),
    openIssues: v.optional(v.number()),
    stars: v.optional(v.number()),
    alivenessScore: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_hot", ["isHot"])
    .index("by_trending", ["isTrending"])
    .index("by_primary_category", ["primaryCategory"])
    .searchIndex("search_tools", {
      searchField: "searchText",
      filterFields: ["primaryCategory", "type"],
    }),

  toolFilters: defineTable({
    toolId: v.id("tools"),
    filterNodeId: v.id("filterNodes"),
  })
    .index("by_tool", ["toolId"])
    .index("by_filter", ["filterNodeId"]),

  votes: defineTable({
    visitorId: v.string(),
    toolId: v.id("tools"),
    filterNodeId: v.id("filterNodes"),
    value: v.number(),
    createdAt: v.number(),
  })
    .index("by_visitor_tool_filter", ["visitorId", "toolId", "filterNodeId"])
    .index("by_tool_filter", ["toolId", "filterNodeId"])
    .index("by_recent", ["createdAt"]),

  categoryVotes: defineTable({
    visitorId: v.string(),
    toolId: v.id("tools"),
    category: v.string(),
    value: v.number(), // +1 or -1
    createdAt: v.number(),
  })
    .index("by_visitor_tool_category", ["visitorId", "toolId", "category"])
    .index("by_tool_category", ["toolId", "category"]),

  stacks: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    visitorId: v.string(),
    isCurated: v.boolean(),
    companyLogoUrl: v.optional(v.string()),
    companyUrl: v.optional(v.string()),
    layers: v.array(
      v.object({
        layerKey: v.string(),
        toolIds: v.array(v.id("tools")),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_visitor", ["visitorId"])
    .index("by_curated", ["isCurated", "createdAt"]),

  toolActivity: defineTable({
    toolId: v.id("tools"),
    weekStart: v.number(),
    commits: v.number(),
    releases: v.number(),
    issuesClosed: v.number(),
  })
    .index("by_tool_week", ["toolId", "weekStart"]),
});
