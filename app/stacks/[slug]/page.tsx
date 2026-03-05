import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { StackViewContent } from "./stack-view-content";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

interface StackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stack = await fetchQuery(api.stacks.bySlug, { slug });

  if (!stack) {
    return { title: "Stack Not Found" };
  }

  const title = `${stack.name} — Tech Stack on ${SITE_NAME}`;
  const description =
    stack.description ??
    `See every tool in the ${stack.name} tech stack — from hosting to payments.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/stacks/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/stacks/${slug}`,
    },
  };
}

export default async function StackPage({ params }: StackPageProps) {
  const { slug } = await params;
  const stack = await fetchQuery(api.stacks.bySlug, { slug });

  if (!stack) {
    notFound();
  }

  return <StackViewContent slug={slug} />;
}
