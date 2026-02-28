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
    type: v.union(v.literal("tool"), v.literal("saas")),
    baselineScore: v.number(),
    pros: v.array(v.string()),
    cons: v.array(v.string()),
    isHot: v.boolean(),
    isTrending: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_hot", ["isHot"])
    .index("by_trending", ["isTrending"]),

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
});
