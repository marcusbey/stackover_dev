import { ExplorerContent } from "./explorer-content";

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "stackover.dev",
    url: "https://stackover.dev",
    description:
      "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://stackover.dev/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "stackover.dev",
    url: "https://stackover.dev",
    logo: "https://stackover.dev/logo.png",
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <ExplorerContent />
    </>
  );
}
