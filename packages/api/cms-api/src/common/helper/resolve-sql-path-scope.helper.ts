import type { ScopedEntitySqlPath } from "../../user-permissions/decorators/scoped-entity.decorator";
import type { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

/**
 * Resolves scope from an entity at runtime using a SQL-path definition.
 * Navigates the object graph following the dot-separated path(s).
 *
 * - String form (e.g. "company.scope"): navigates the path to get the scope object
 * - Object form (e.g. { domain: "company.scope.domain" }): builds a scope from individual field paths
 *
 * Handles MikroORM Reference/Ref objects by calling `.load()` when needed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resolveSqlPathScopeFromEntity(sqlPath: ScopedEntitySqlPath, entity: any): Promise<ContentScope> {
    if (typeof sqlPath === "string") {
        return (await navigatePath(sqlPath, entity)) as ContentScope;
    } else {
        const scope: Record<string, unknown> = {};
        for (const [scopeField, fieldPath] of Object.entries(sqlPath)) {
            scope[scopeField] = await navigatePath(fieldPath, entity);
        }
        return scope as ContentScope;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function navigatePath(path: string, entity: any): Promise<unknown> {
    const parts = path.split(".");
    let current = entity;
    for (const part of parts) {
        if (current == null) {
            throw new Error(`Cannot resolve scope path "${path}": encountered null/undefined at "${part}"`);
        }
        // Handle MikroORM Reference/Ref objects (lazy-loaded relations)
        if (typeof current.load === "function" && typeof current.unwrap === "function") {
            current = await current.load();
        }
        if (current[part] !== undefined) {
            current = current[part];
        } else if (typeof current.init === "function") {
            current = await current.init();
            current = current?.[part];
        } else {
            throw new Error(`Cannot resolve scope path "${path}": property "${part}" not found`);
        }
    }
    // Handle final value being a Reference
    if (current != null && typeof current.load === "function" && typeof current.unwrap === "function") {
        current = await current.load();
    }
    return current;
}
