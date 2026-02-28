/* eslint-disable */
/**
 * Generated data model types — regenerate with `npx convex dev`.
 *
 * THIS FILE IS A STUB created so the project builds without a live
 * Convex deployment. Run `npx convex dev` to replace it with the
 * real generated file.
 */
import type { DataModelFromSchemaDefinition } from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

/**
 * An identifier for a document in a Convex table.
 */
export type Id<TableName extends string> = GenericId<TableName>;
