import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { TypeMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/type-metadata.storage";

/**
 * Reset NestJS GraphQL's global metadata storages.
 *
 * Schema-building tests in this package compile a tiny resolver into a full GraphQL schema.
 * NestJS' `GraphQLSchemaFactory` operates on two global registries that are populated as
 * a side-effect of importing any `@ObjectType` / `@Field` decorated class. Under Vitest/SWC
 * many more such classes get transitively imported than under ts-jest (which elides
 * value-only imports of types), so the schema build ends up referencing types that aren't
 * relevant to the test and fails.
 *
 * Clearing both storages before a test isolates it from previously-loaded modules.
 */
export function clearGraphqlMetadataStorages(): void {
    TypeMetadataStorage.clear();
    // `LazyMetadataStorage` has no public `clear()`. The host stores callbacks keyed by
    // target in `lazyMetadataByTarget`; replacing the map drops every previously-registered
    // `@Field` callback so they can't be replayed by `LazyMetadataStorage.load()`.
    (LazyMetadataStorage as unknown as { lazyMetadataByTarget: Map<unknown, unknown> }).lazyMetadataByTarget = new Map();
}
