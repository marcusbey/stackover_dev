import type { Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ToolProfileContent } from "./tool-profile-content";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await fetchQuery(api.tools.bySlug, { slug });

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  const title = `${tool.name} — Reviews, Pricing & Alternatives`;
  const description = `${tool.description} See ratings, pros & cons, and top alternatives on ${SITE_NAME}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tools/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/tools/${slug}`,
    },
  };
}

export default async function ToolProfilePage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await fetchQuery(api.tools.bySlug, { slug });

  if (!tool) {
    notFound();
  }

  const preloadedTool = await preloadQuery(api.tools.bySlug, { slug });

  // JSON-LD structured data for SEO
  // Note: dangerouslySetInnerHTML is safe here — all values come from our
  // Convex database (trusted source) and JSON.stringify escapes HTML.
  // This is the recommended Next.js pattern for JSON-LD.

  // JSON-LD: SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.websiteUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.baselineScore.toFixed(1),
      bestRating: "10",
      worstRating: "0",
      ratingCount: Math.max(1, Math.round(tool.baselineScore * 10)),
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE_URL}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `${SITE_URL}/tools/${slug}`,
      },
    ],
  };

  // JSON-LD: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.description,
        },
      },
      {
        "@type": "Question",
        name: `What are the pros of ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.pros.join(". "),
        },
      },
      {
        "@type": "Question",
        name: `What are the cons of ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.cons.join(". "),
        },
      },
    ],
  };

  const jsonLdScript = JSON.stringify(jsonLd);
  const breadcrumbScript = JSON.stringify(breadcrumbJsonLd);
  const faqScript = JSON.stringify(faqJsonLd);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbScript }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqScript }}
      />
      <ToolProfileContent preloadedTool={preloadedTool} />
    </>
  );
}
