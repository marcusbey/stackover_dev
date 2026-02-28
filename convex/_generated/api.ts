/* eslint-disable */
/**
 * Generated API reference — regenerate with `npx convex dev`.
 *
 * THIS FILE IS A STUB created so the project builds without a live
 * Convex deployment. Run `npx convex dev` to replace it with the
 * real generated file.
 */
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import { anyApi } from "convex/server";

import type * as domains from "../domains.js";
import type * as filterNodes from "../filterNodes.js";
import type * as seed from "../seed.js";
import type * as tools from "../tools.js";
import type * as votes from "../votes.js";

/**
 * A type describing your app's public Convex API.
 */
declare const fullApi: ApiFromModules<{
  domains: typeof domains;
  filterNodes: typeof filterNodes;
  seed: typeof seed;
  tools: typeof tools;
  votes: typeof votes;
}>;

export const api: FilterApi<typeof fullApi, FunctionReference<any, "public">> =
  anyApi as any;
export const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
> = anyApi as any;
