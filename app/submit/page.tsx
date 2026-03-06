"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, ArrowLeft } from "lucide-react";
import { SEARCH_CATEGORIES } from "@/lib/search-constants";

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const isValid =
    name.trim().length > 0 &&
    website.trim().length > 0 &&
    category.length > 0 &&
    description.trim().length > 0;

  const githubUrl = isValid
    ? `https://github.com/marcusbey/stackover_dev/issues/new?title=${encodeURIComponent(`Tool Submission: ${name.trim()}`)}&body=${encodeURIComponent(`**Tool Name:** ${name.trim()}\n**Website:** ${website.trim()}\n**Category:** ${category}\n**Description:** ${description.trim()}\n\n---\n_Submitted via stackover.dev/submit_`)}&labels=tool-submission`
    : "#";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-xl px-4 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explorer
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Submit a Tool
          </h1>
          <p className="text-muted-foreground">
            Know a great tool that should be on StackOver? Fill out the form
            below and we&apos;ll review it.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1.5"
            >
              Tool Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Supabase"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium mb-1.5"
            >
              Website URL
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1.5"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Select a category...</option>
              {SEARCH_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does this tool do? Why should it be listed?"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isValid
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
            }`}
          >
            <Send className="h-4 w-4" />
            Submit via GitHub
          </a>

          <p className="text-xs text-muted-foreground">
            Submissions are reviewed within 48 hours. This creates a GitHub
            issue for tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
