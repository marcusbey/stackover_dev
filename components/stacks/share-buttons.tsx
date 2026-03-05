"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Hammer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

interface ShareButtonsProps {
  stackName: string;
  slug: string;
}

export function ShareButtons({ stackName, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/stacks/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out my tech stack "${stackName}" on ${SITE_NAME}`
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <Check className="h-4 w-4 mr-1" />
        ) : (
          <Copy className="h-4 w-4 mr-1" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
          Share on X
        </a>
      </Button>

      <Button size="sm" asChild>
        <Link href="/stacks/new">
          <Hammer className="h-4 w-4 mr-1" />
          Build Your Own
        </Link>
      </Button>
    </div>
  );
}
