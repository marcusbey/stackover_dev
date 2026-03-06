import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Guides, deep dives, and insights on the best developer tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            More articles coming soon. Want to contribute?
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
          >
            Write for StackOver
          </Link>
        </div>
      </div>
    </div>
  );
}
