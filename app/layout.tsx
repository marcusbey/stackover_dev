import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stackover.dev"),
  title: {
    default: "stackover.dev — Discover the Best AI Tools, Templates & Agents",
    template: "%s | stackover.dev",
  },
  description:
    "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes. Find the right stack for what you're building.",
  keywords: [
    "AI tools",
    "developer tools",
    "startup tools",
    "AI agents",
    "AI templates",
    "tech stack",
    "SaaS tools",
    "best AI tools 2026",
  ],
  openGraph: {
    type: "website",
    siteName: "stackover.dev",
    title: "stackover.dev — Discover the Best AI Tools, Templates & Agents",
    description:
      "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes.",
    url: "https://stackover.dev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "stackover.dev — Discover the Best AI Tools, Templates & Agents",
    description:
      "Compare 2,400+ AI tools, developer templates, and agents. Community-ranked with real votes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://stackover.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
