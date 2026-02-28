/* eslint-disable */
/**
 * Generated server utilities — regenerate with `npx convex dev`.
 *
 * THIS FILE IS A STUB created so the project builds without a live
 * Convex deployment. Run `npx convex dev` to replace it with the
 * real generated file.
 */
import {
  queryGeneric,
  mutationGeneric,
  actionGeneric,
  internalQueryGeneric,
  internalMutationGeneric,
  internalActionGeneric,
  type QueryBuilder,
  type MutationBuilder,
  type ActionBuilder,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

export const query = queryGeneric as QueryBuilder<DataModel, "public">;
export const internalQuery = internalQueryGeneric as QueryBuilder<
  DataModel,
  "internal"
>;
export const mutation = mutationGeneric as MutationBuilder<
  DataModel,
  "public"
>;
export const internalMutation = internalMutationGeneric as MutationBuilder<
  DataModel,
  "internal"
>;
export const action = actionGeneric as ActionBuilder<DataModel, "public">;
export const internalAction = internalActionGeneric as ActionBuilder<
  DataModel,
  "internal"
>;
