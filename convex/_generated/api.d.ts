/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categoryVotes from "../categoryVotes.js";
import type * as crons from "../crons.js";
import type * as domains from "../domains.js";
import type * as filterNodes from "../filterNodes.js";
import type * as github from "../github.js";
import type * as seed from "../seed.js";
import type * as seedProducts from "../seedProducts.js";
import type * as seedStacks from "../seedStacks.js";
import type * as seo from "../seo.js";
import type * as stacks from "../stacks.js";
import type * as syncActivity from "../syncActivity.js";
import type * as tools from "../tools.js";
import type * as votes from "../votes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  categoryVotes: typeof categoryVotes;
  crons: typeof crons;
  domains: typeof domains;
  filterNodes: typeof filterNodes;
  github: typeof github;
  seed: typeof seed;
  seedProducts: typeof seedProducts;
  seedStacks: typeof seedStacks;
  seo: typeof seo;
  stacks: typeof stacks;
  syncActivity: typeof syncActivity;
  tools: typeof tools;
  votes: typeof votes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
