"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CATEGORY_MAP } from "@/lib/search-constants";
import { getLogoUrl } from "@/lib/logos";
import { cn } from "@/lib/utils";
import { CategoryVoteButton } from "@/components/category-vote-button";
import Link from "next/link";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Emoji map for category header decoration
// ---------------------------------------------------------------------------
const CATEGORY_EMOJI: Record<string, string> = {
  ai: "\u{1F9E0}",
  "dev-tools": "\u{1F527}",
  databases: "\u{1F4BE}",
  cloud: "\u2601\uFE0F",
  web: "\u{1F310}",
  mobile: "\u{1F4F1}",
  design: "\u{1F3A8}",
  video: "\u{1F3AC}",
  nocode: "\u{1F9E9}",
  analytics: "\u{1F4CA}",
  marketing: "\u{1F4E3}",
  sales: "\u{1F91D}",
  support: "\u{1F3A7}",
  collaboration: "\u{1F465}",
  auth: "\u{1F6E1}\uFE0F",
  payments: "\u{1F4B3}",
  ecommerce: "\u{1F6D2}",
  communication: "\u{1F4AC}",
  cms: "\u{1F4DD}",
  hr: "\u{1F4BC}",
  education: "\u{1F393}",
  social: "\u{1F310}",
  automation: "\u26A1",
  search: "\u{1F50D}",
  monitoring: "\u{1F4C8}",
  hosting: "\u{1F5A5}\uFE0F",
  domains: "\u{1F310}",
  "ai-agents": "\u{1F916}",
  "ai-image": "\u{1F5BC}\uFE0F",
  "ai-coding": "\u{1F4BB}",
  "ui-kits": "\u{1F9E9}",
  prototyping: "\u{270F}\uFE0F",
  "design-systems": "\u{1F4D0}",
  "frontend-libs": "\u{1F9E9}",
  "backend-libs": "\u{1F5A5}\uFE0F",
  "icons-fonts": "\u{1F3A8}",
};

// ---------------------------------------------------------------------------
// Rank medal labels for the podium
// ---------------------------------------------------------------------------
const RANK_MEDAL: Record<number, string> = {
  1: "\u{1F947}",
  2: "\u{1F948}",
  3: "\u{1F949}",
};

// ---------------------------------------------------------------------------
// Small helper: logo with fallback
// ---------------------------------------------------------------------------
function ToolLogo({
  websiteUrl,
  name,
  size = 40,
}: {
  websiteUrl: string;
  name: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div
        className="rounded-lg bg-muted flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <span className="text-sm font-bold text-muted-foreground">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={getLogoUrl(websiteUrl)}
      alt={name}
      width={size}
      height={size}
      className="rounded-lg object-contain flex-shrink-0"
      onError={() => setImgError(true)}
    />
  );
}

// ---------------------------------------------------------------------------
// Tool type from the API
// ---------------------------------------------------------------------------
interface RankedTool {
  _id: Id<"tools">;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  type?: "tool" | "saas" | "course" | "resource";
  baselineScore: number;
  tags?: string[];
  primaryCategory?: string;
  courseUrl?: string;
  provider?: string;
  isFree?: boolean;
  upvotes: number;
  downvotes: number;
  netVotes: number;
  voteCount: number;
}

// ===========================================================================
// Page component
// ===========================================================================
export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // ---- Visitor ID (localStorage, client-only) -----------------------------
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("stackatlas-visitor-id");
    if (stored) {
      setVisitorId(stored);
    } else {
      const id = crypto.randomUUID();
      localStorage.setItem("stackatlas-visitor-id", id);
      setVisitorId(id);
    }
  }, []);

  // ---- Category lookup ----------------------------------------------------
  const category = CATEGORY_MAP[slug];

  // ---- Convex queries -----------------------------------------------------
  const tools = useQuery(
    api.tools.byCategoryRanked,
    category ? { category: slug } : "skip"
  ) as RankedTool[] | undefined;

  const userVotesMap = useQuery(
    api.categoryVotes.userVotes,
    visitorId && category ? { visitorId, category: slug } : "skip"
  ) as Record<string, number> | undefined;

  const companies = useQuery(
    api.stacks.companiesUsingCategory,
    category ? { category: slug } : "skip"
  );

  // ---- 404-style fallback -------------------------------------------------
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-5xl">🗂️</p>
        <h1 className="text-2xl font-bold">Category not found</h1>
        <p className="text-muted-foreground max-w-md">
          There is no category matching <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">{slug}</code>. Please double-check the URL or go back to the homepage.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go home
        </Link>
      </div>
    );
  }

  // ---- Loading skeleton ---------------------------------------------------
  if (!tools) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="h-5 w-24 rounded bg-muted animate-pulse mb-10" />

          {/* Podium skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl border bg-card animate-pulse",
                  i === 0 ? "md:order-2 h-64" : "h-56"
                )}
              />
            ))}
          </div>

          {/* Table skeleton */}
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Tab state -----------------------------------------------------------
  const [activeTab, setActiveTab] = useState<"tools" | "courses" | "resources">("tools");

  // ---- Derived data -------------------------------------------------------
  const toolItems = tools.filter((t) => !t.type || t.type === "tool" || t.type === "saas");
  const courseItems = tools.filter((t) => t.type === "course");
  const resourceItems = tools.filter((t) => t.type === "resource");

  const podiumTools = toolItems.slice(0, 3);
  const remainingTools = toolItems.slice(3);
  const emoji = CATEGORY_EMOJI[slug] ?? "\u{1F4E6}";

  // ---- Render -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* ================================================================ */}
        {/* Header */}
        {/* ================================================================ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">{emoji}</span>
            <h1 className="text-3xl font-bold tracking-tight">
              {category.label}
            </h1>
          </div>
          <p className="text-muted-foreground text-sm ml-[52px]">
            {tools.length} item{tools.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ================================================================ */}
        {/* Used by companies */}
        {/* ================================================================ */}
        {companies && companies.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Used by
            </span>
            <div className="flex items-center gap-2">
              {companies.map((company) => (
                <Link
                  key={company.slug}
                  href={`/stacks/${company.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {company.companyLogoUrl && (
                    <Image
                      src={company.companyLogoUrl}
                      alt={company.name}
                      width={14}
                      height={14}
                      className="rounded-sm"
                    />
                  )}
                  {company.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* Tabs: Tools | Courses | Resources */}
        {/* ================================================================ */}
        <div className="flex gap-1 mb-8 border-b">
          {(["tools", "courses", "resources"] as const).map((tab) => {
            const count =
              tab === "tools" ? toolItems.length
              : tab === "courses" ? courseItems.length
              : resourceItems.length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* Courses tab */}
        {/* ================================================================ */}
        {activeTab === "courses" && (
          courseItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <span className="text-5xl mb-4">{emoji}</span>
              <p className="font-medium">No courses in this category yet</p>
              <p className="text-sm mt-1">Suggest one and help the community learn!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseItems.map((item) => (
                <div key={item._id} className="rounded-xl border bg-card p-5 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{item.name}</span>
                      {item.provider && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {item.provider}
                        </span>
                      )}
                      {item.isFree !== undefined && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          item.isFree ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {item.isFree ? "Free" : "Paid"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    {item.courseUrl && (
                      <a
                        href={item.courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View course
                      </a>
                    )}
                  </div>
                  <CategoryVoteButton
                    toolId={item._id}
                    category={slug}
                    netVotes={item.netVotes}
                    userVote={userVotesMap?.[item._id]}
                  />
                </div>
              ))}
            </div>
          )
        )}

        {/* ================================================================ */}
        {/* Resources tab */}
        {/* ================================================================ */}
        {activeTab === "resources" && (
          resourceItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <span className="text-5xl mb-4">{emoji}</span>
              <p className="font-medium">No resources in this category yet</p>
              <p className="text-sm mt-1">Know a great resource? Suggest one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resourceItems.map((item) => (
                <div key={item._id} className="rounded-xl border bg-card p-5 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{item.name}</span>
                      {item.provider && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {item.provider}
                        </span>
                      )}
                      {item.isFree !== undefined && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          item.isFree ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {item.isFree ? "Free" : "Paid"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                    {item.websiteUrl && (
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Visit resource
                      </a>
                    )}
                  </div>
                  <CategoryVoteButton
                    toolId={item._id}
                    category={slug}
                    netVotes={item.netVotes}
                    userVote={userVotesMap?.[item._id]}
                  />
                </div>
              ))}
            </div>
          )
        )}

        {/* ================================================================ */}
        {/* Podium — Top 3 (Tools tab only) */}
        {/* ================================================================ */}
        {activeTab === "tools" && podiumTools.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 items-end">
            {podiumTools.map((tool, idx) => {
              const rank = idx + 1;
              // On desktop: order 2nd, 1st, 3rd so #1 is in the center
              const orderClass =
                rank === 1
                  ? "md:order-2"
                  : rank === 2
                    ? "md:order-1"
                    : "md:order-3";
              const isFirst = rank === 1;

              return (
                <div
                  key={tool._id}
                  className={cn(
                    "group relative rounded-xl border bg-card p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg",
                    isFirst && "md:pb-8 md:-mt-4 ring-1 ring-primary/20",
                    orderClass
                  )}
                >
                  {/* Rank medal */}
                  <span className="text-3xl mb-3">
                    {RANK_MEDAL[rank]}
                  </span>

                  {/* Logo */}
                  <div className="mb-3">
                    <ToolLogo
                      websiteUrl={tool.websiteUrl}
                      name={tool.name}
                      size={isFirst ? 56 : 48}
                    />
                  </div>

                  {/* Name */}
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="font-semibold text-lg hover:underline underline-offset-2 mb-1"
                  >
                    {tool.name}
                  </Link>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 max-w-[240px]">
                    {tool.description}
                  </p>

                  {/* Vote button */}
                  <CategoryVoteButton
                    toolId={tool._id}
                    category={slug}
                    netVotes={tool.netVotes}
                    userVote={userVotesMap?.[tool._id]}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================ */}
        {/* Ranking table — #4 onward */}
        {/* ================================================================ */}
        {activeTab === "tools" && remainingTools.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[3rem_1fr_2fr_auto_3.5rem] md:grid-cols-[3rem_1fr_2fr_10rem_3.5rem] gap-4 px-4 py-3 border-b bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>#</span>
              <span>Tool</span>
              <span className="hidden md:block">Description</span>
              <span className="hidden md:block">Tags</span>
              <span className="text-center">Votes</span>
            </div>

            {/* Rows */}
            {remainingTools.map((tool, idx) => {
              const rank = idx + 4;
              return (
                <div
                  key={tool._id}
                  className="grid grid-cols-[3rem_1fr_auto_3.5rem] md:grid-cols-[3rem_1fr_2fr_10rem_3.5rem] gap-4 items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  {/* Rank */}
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                    {rank}
                  </span>

                  {/* Tool (logo + name) */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ToolLogo
                      websiteUrl={tool.websiteUrl}
                      name={tool.name}
                      size={32}
                    />
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm font-medium truncate hover:underline underline-offset-2"
                    >
                      {tool.name}
                    </Link>
                  </div>

                  {/* Description (hidden on mobile) */}
                  <p className="hidden md:block text-xs text-muted-foreground line-clamp-1">
                    {tool.description}
                  </p>

                  {/* Tags (hidden on mobile) */}
                  <div className="hidden md:flex flex-wrap gap-1">
                    {tool.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Vote */}
                  <div className="flex justify-center">
                    <CategoryVoteButton
                      toolId={tool._id}
                      category={slug}
                      netVotes={tool.netVotes}
                      userVote={userVotesMap?.[tool._id]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================ */}
        {/* Empty state (Tools tab) */}
        {/* ================================================================ */}
        {activeTab === "tools" && toolItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <span className="text-5xl mb-4">{emoji}</span>
            <p className="font-medium">No tools in this category yet</p>
            <p className="text-sm mt-1">Check back soon — new tools are added every day.</p>
          </div>
        )}
      </div>
    </div>
  );
}
