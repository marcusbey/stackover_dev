import type { Metadata } from "next";
import { StackWizard } from "./stack-wizard";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Build Your Tech Stack — ${SITE_NAME}`,
  description:
    "Choose the best tools for every layer of your product. Our step-by-step wizard helps you build a complete tech stack in minutes.",
};

export default function StackBuilderPage() {
  return <StackWizard />;
}
