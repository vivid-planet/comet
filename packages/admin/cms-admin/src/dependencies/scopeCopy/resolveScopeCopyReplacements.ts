import isEqual from "lodash.isequal";

import type { BlockDependency, ReplaceDependencyObject } from "../../blocks/types";
import type { ScopeCopyHandler, ScopeCopyHandlerContext } from "./ScopeCopyHandler";

/**
 * Resolves the dependency replacements for a scope-crossing copy.
 *
 * Dependencies are grouped by type and deduplicated, then delegated to the matching
 * {@link ScopeCopyHandler}. Dependencies without a handler are cleared (fail-secure) so a copy
 * never keeps a dangling reference to an entity that only exists in the source scope.
 *
 * Returns an empty array when source and target scope are equal (nothing to copy).
 */
export async function resolveScopeCopyReplacements({
    dependencies,
    handlers,
    context,
    existingReplacements = [],
}: {
    dependencies: BlockDependency[];
    handlers: ScopeCopyHandler[];
    context: ScopeCopyHandlerContext;
    existingReplacements?: ReplaceDependencyObject[];
}): Promise<ReplaceDependencyObject[]> {
    if (isEqual(context.sourceScope, context.targetScope)) {
        return [];
    }

    const dependenciesByType = new Map<string, Map<string, BlockDependency>>();
    for (const dependency of dependencies) {
        const alreadyHandled = existingReplacements.some(
            (replacement) => replacement.type === dependency.targetGraphqlObjectType && replacement.originalId === dependency.id,
        );
        if (alreadyHandled) {
            continue;
        }

        let uniqueDependencies = dependenciesByType.get(dependency.targetGraphqlObjectType);
        if (!uniqueDependencies) {
            uniqueDependencies = new Map();
            dependenciesByType.set(dependency.targetGraphqlObjectType, uniqueDependencies);
        }
        if (!uniqueDependencies.has(dependency.id)) {
            uniqueDependencies.set(dependency.id, dependency);
        }
    }

    const replacements: ReplaceDependencyObject[] = [];

    for (const [dependencyType, uniqueDependencies] of dependenciesByType) {
        const dependenciesOfType = Array.from(uniqueDependencies.values());
        const handler = handlers.find((handler) => handler.dependencyType === dependencyType);

        if (!handler) {
            for (const dependency of dependenciesOfType) {
                replacements.push({ type: dependencyType, originalId: dependency.id, replaceWithId: undefined });
            }
            continue;
        }

        const handlerReplacements = await handler.copyToScope(
            dependenciesOfType.map(({ id, data }) => ({ id, data })),
            context,
        );
        replacements.push(...handlerReplacements);
    }

    return replacements;
}
