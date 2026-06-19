import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";

import type { BlockDependency, ReplaceDependencyObject } from "../../blocks/types";
import type { ContentScope } from "../../contentScope/Provider";
import { resolveScopeCopyReplacements } from "./resolveScopeCopyReplacements";
import { useScopeCopyHandlers } from "./useScopeCopyHandlers";

/**
 * Convenience hook for copying the dependencies of some content to a target scope.
 *
 * It bundles the {@link useScopeCopyHandlers} registry and the Apollo client, so project code that
 * copies its own entities across scopes can resolve the dependency replacements in a single call
 * without wiring up {@link resolveScopeCopyReplacements} manually.
 *
 * The returned function copies the referenced entities to the target scope (via the handlers) and
 * returns the `ReplaceDependencyObject`s to apply to the copied content with `replaceDependenciesInOutput`.
 */
export function useCopyDependenciesToScope(): (params: {
    dependencies: BlockDependency[];
    sourceScope: ContentScope;
    targetScope: ContentScope;
    existingReplacements?: ReplaceDependencyObject[];
}) => Promise<ReplaceDependencyObject[]> {
    const client = useApolloClient();
    const handlers = useScopeCopyHandlers();

    return useCallback(
        ({ dependencies, sourceScope, targetScope, existingReplacements }) =>
            resolveScopeCopyReplacements({
                dependencies,
                handlers,
                context: { client, sourceScope, targetScope },
                existingReplacements,
            }),
        [client, handlers],
    );
}
