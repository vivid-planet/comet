import type { ApolloClient } from "@apollo/client";
import type { ReactNode } from "react";

import type { ReplaceDependencyObject } from "../../blocks/types";
import type { ContentScope } from "../../contentScope/Provider";

export interface ScopeCopyHandlerContext {
    client: ApolloClient<object>;
    /**
     * Source and target are *content* scopes. An entity type may use its own scope concept that is
     * derived from (and can be coarser than) the content scope — e.g. the DAM scope. Mapping the
     * content scope to the entity's own scope is the handler's responsibility (typically by reading
     * the entity-specific scope context, like `useDamScope`, when the handler is created).
     */
    sourceScope: ContentScope;
    targetScope: ContentScope;
    reportProgress?: (info: { current: number; total: number; message?: ReactNode }) => void;
}

/**
 * Defines how dependencies of a single entity type are copied to a target scope during a
 * scope-crossing copy (e.g. copying a page or pasting a block into another scope).
 *
 * A handler receives all dependencies of its `dependencyType` and returns the replacements
 * that should be applied to the copied content. The returned `ReplaceDependencyObject`s encode
 * the outcome per dependency:
 *
 * - point to a copy in the target scope: `{ replaceWithId: <new id> }`
 * - reuse an entity that already exists in the target scope: `{ replaceWithId: <existing id> }`
 * - keep the original reference (e.g. same scope, or an unscoped/global entity): omit the dependency from the result
 * - clear the reference because it can't be copied: `{ replaceWithId: undefined }`
 * - abort the whole copy: throw
 *
 * Dependency types without a registered handler are cleared (fail-secure), so a copy never keeps a
 * dangling reference to a scoped entity from the source scope. For unscoped/global entities — whose
 * references stay valid in any scope — register {@link createUnscopedScopeCopyHandler} to keep them.
 */
export interface ScopeCopyHandler<Data = unknown> {
    /** Matches `BlockDependency.targetGraphqlObjectType`, e.g. `"DamFile"`. */
    dependencyType: string;
    // Method syntax (bivariant parameters) so a handler typed with specific dependency data
    // (e.g. ScopeCopyHandler<DamFileDependencyData>) is assignable to the ScopeCopyHandler[] registry.
    copyToScope(dependencies: Array<{ id: string; data: Data }>, context: ScopeCopyHandlerContext): Promise<ReplaceDependencyObject[]>;
}

/**
 * Scope copy handler for an entity type that is not scoped (global / shared across all scopes).
 * Its references stay valid in any target scope, so nothing is copied and all references are kept.
 */
export function createUnscopedScopeCopyHandler(dependencyType: string): ScopeCopyHandler {
    return {
        dependencyType,
        copyToScope: async () => [],
    };
}
