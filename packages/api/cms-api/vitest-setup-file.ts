import "reflect-metadata";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { TypeMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage";
import { beforeEach } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MetadataByTargetCollection } = require("@nestjs/graphql/dist/schema-builder/collections/metadata-by-target.collection");

beforeEach(() => {
    // Reset NestJS GraphQL global singleton state before each test.
    // This prevents transitive module imports (e.g., @ObjectType()-decorated entities)
    // from polluting the schema factory during tests that use GraphQLSchemaFactory.
    const lm = LazyMetadataStorage as unknown as Record<string, unknown>;
    lm["lazyMetadataByTarget"] = new Map();

    const tm = TypeMetadataStorage as unknown as Record<string, unknown>;
    tm["queries"] = [];
    tm["mutations"] = [];
    tm["subscriptions"] = [];
    tm["fieldResolvers"] = [];
    tm["enums"] = [];
    tm["unions"] = [];
    tm["metadataByTargetCollection"] = new MetadataByTargetCollection();
    tm["compiledResolvers"] = undefined;
});
