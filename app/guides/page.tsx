import Link from "next/link";
import { GUIDES } from "@/lib/guides-data";
import { IntentIcon } from "@/components/intent-icon";
import { ArrowRight } from "lucide-react";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Stack Guides
          </h1>
          <p className="text-muted-foreground">
            Curated tool combinations for common use cases. Pick a guide and
            explore the best stack for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/categories/${guide.categories[0]}`}
              className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-muted/80 flex items-center justify-center">
                  <IntentIcon
                    name={guide.icon}
                    className="h-5 w-5 text-muted-foreground"
                  />
                </div>
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {guide.title}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {guide.description}
              </p>

              {/* Stack preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {guide.steps.map((step) => (
                  <span
                    key={step}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {step}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Explore stack
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Want to build a custom stack?
          </p>
          <Link
            href="/stacks/new"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Open Stack Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
