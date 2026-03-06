"use client";

import Link from "next/link";
import {
  Lightbulb,
  Palette,
  Component,
  Server,
  Lock,
  Cloud,
  Megaphone,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: 1,
    title: "Validate Your Idea",
    description: "Research the market, survey users, and test with a landing page.",
    icon: Lightbulb,
    category: "analytics",
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    step: 2,
    title: "Design & Prototype",
    description: "Pick a design system, prototype your UI, choose your icons and fonts.",
    icon: Palette,
    category: "design",
    color: "bg-rose-50 border-rose-200 text-rose-700",
  },
  {
    step: 3,
    title: "Build Your Frontend",
    description: "Choose your framework, component library, and state management.",
    icon: Component,
    category: "frontend-libs",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    step: 4,
    title: "Build Your Backend",
    description: "Pick a server framework, database, ORM, and API layer.",
    icon: Server,
    category: "backend-libs",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    step: 5,
    title: "Add Auth & Payments",
    description: "Set up authentication, billing, and subscription management.",
    icon: Lock,
    category: "auth",
    color: "bg-slate-50 border-slate-200 text-slate-700",
  },
  {
    step: 6,
    title: "Deploy & Monitor",
    description: "Host your app, set up CI/CD, logging, and error tracking.",
    icon: Cloud,
    category: "cloud",
    color: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    step: 7,
    title: "Market & Grow",
    description: "Launch your SEO, email campaigns, and growth tools.",
    icon: Megaphone,
    category: "marketing",
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    step: 8,
    title: "Support & Iterate",
    description: "Set up customer support, collect feedback, and automate workflows.",
    icon: Headphones,
    category: "support",
    color: "bg-violet-50 border-violet-200 text-violet-700",
  },
];

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            From Idea to Market
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Everything you need to build and launch your app, step by step.
            Each stage links to the best tools for the job.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-border hidden md:block" />

          <div className="space-y-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Link
                  key={step.step}
                  href={`/categories/${step.category}`}
                  className={cn(
                    "group relative flex items-start gap-5 rounded-xl border p-5 transition-all hover:shadow-md",
                    step.color
                  )}
                >
                  {/* Step number + icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                        Step {step.step}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold mb-0.5">{step.title}</h2>
                    <p className="text-sm opacity-70">{step.description}</p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="h-5 w-5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70 self-center" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
