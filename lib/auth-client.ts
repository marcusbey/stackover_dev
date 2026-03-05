import { createAuthClient } from "better-auth/react";
import { SITE_URL } from "@/lib/site-config";

export const authClient = createAuthClient({
  baseURL: SITE_URL,
});
