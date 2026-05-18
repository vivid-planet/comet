import { MikroORM } from "@mikro-orm/postgresql";
import { ExecutionContext, Injectable, Optional } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { isInjectableService } from "../common/helper/is-injectable-service.helper";
import { PageTreeService } from "../page-tree/page-tree.service";
import {
    isScopedEntitySqlResolvable,
    SCOPED_ENTITY_METADATA_KEY,
    ScopedEntityMeta,
    ScopedEntitySqlMapping,
} from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { AFFECTED_ENTITY_METADATA_KEY, AffectedEntityMeta } from "./decorators/affected-entity.decorator";
import { AFFECTED_SCOPE_METADATA_KEY, AffectedScopeMeta } from "./decorators/affected-scope.decorator";

/**
 * Resolves scope from an entity instance using a SQL-resolvable ScopedEntity meta.
 * - String: dot-path to an embedded object (e.g., "scope" reads entity.scope)
 * - Object mapping: keys are scope property names, values are dot-paths (e.g., { domain: "scope.domain" })
 */
export function resolveScopeFromEntity(meta: string | ScopedEntitySqlMapping, entity: Record<string, unknown>): ContentScope {
    if (typeof meta === "string") {
        const value = getNestedValue(entity, meta);
        if (typeof value !== "object" || value === null) {
            throw new Error(`@ScopedEntity("${meta}") resolved to a non-object value on entity`);
        }
        return { ...value } as ContentScope;
    }

    const scope: Record<string, unknown> = {};
    for (const [scopeKey, fieldPath] of Object.entries(meta)) {
        scope[scopeKey] = getNestedValue(entity, fieldPath);
    }
    return scope as ContentScope;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split(".");
    let current: unknown = obj;
    for (const part of parts) {
        if (current === null || current === undefined || typeof current !== "object") {
            return undefined;
        }
        current = (current as Record<string, unknown>)[part];
    }
    return current;
}

// TODO Remove service and move into UserPermissionsGuard once ChangesCheckerInterceptor is removed
@Injectable()
export class ContentScopeService {
    constructor(
        private reflector: Reflector,
        private readonly orm: MikroORM,
        private readonly moduleRef: ModuleRef,
        @Optional() private readonly pageTreeService?: PageTreeService,
    ) {}

    scopesAreEqual(scope1: ContentScope | undefined, scope2: ContentScope | undefined): boolean {
        // The scopes are cloned because they could be
        //   - an instance of a class (e.g. DamScope)
        //   - or a plain object (from a GraphQL input)
        // Then they are not deeply equal, although they represent the same scope
        return isEqual({ ...scope1 }, { ...scope2 });
    }

    async getScopesForPermissionCheck(context: ExecutionContext): Promise<ContentScope[][]> {
        const contentScopes: ContentScope[][] = [];
        const args = await this.getArgs(context);
        const location = `${context.getClass().name}::${context.getHandler().name}()`;

        // AffectedEntities
        const affectedEntities = this.reflector.getAllAndOverride<AffectedEntityMeta[]>(AFFECTED_ENTITY_METADATA_KEY, [context.getHandler()]) || [];
        for (const affectedEntity of affectedEntities) {
            contentScopes.push(...(await this.getContentScopesFromEntity(affectedEntity, args, location)));
        }

        // AffectedScope
        const affectedScope = this.reflector.getAllAndOverride<AffectedScopeMeta>(AFFECTED_SCOPE_METADATA_KEY, [context.getHandler()]) || undefined;
        if (affectedScope) {
            contentScopes.push([affectedScope.argsToScope(args) as ContentScope]);
        }

        // Scope arg
        if (args.scope) {
            contentScopes.push([args.scope as ContentScope]);
        }

        return contentScopes;
    }

    async inferScopesFromExecutionContext(context: ExecutionContext): Promise<ContentScope[]> {
        return this.getUniqueScopes(await this.getScopesForPermissionCheck(context));
    }

    getUniqueScopes(scopes: ContentScope[][]): ContentScope[] {
        const uniqueScopes: ContentScope[] = [];

        scopes.flat().forEach((incomingScope) => {
            if (!uniqueScopes.some((existingScope) => this.scopesAreEqual(existingScope, incomingScope))) {
                uniqueScopes.push(incomingScope);
            }
        });

        return uniqueScopes;
    }

    private async getContentScopesFromEntity(
        affectedEntity: AffectedEntityMeta,
        args: Record<string, string>,
        location: string,
    ): Promise<ContentScope[][]> {
        const contentScopes: ContentScope[][] = [];
        if (affectedEntity.options.idArg) {
            if (!args[affectedEntity.options.idArg] && !affectedEntity.options.nullable) {
                throw new Error(`${affectedEntity.options.idArg} arg not found`);
            }

            if (args[affectedEntity.options.idArg]) {
                const repo = this.orm.em.getRepository<{ scope?: ContentScope }>(affectedEntity.entity);
                const id = args[affectedEntity.options.idArg];
                const ids = Array.isArray(id) ? id : [id];

                if (ids.length === 0) {
                    throw new Error(
                        `Encountered empty IDs array for argument '${affectedEntity.options.idArg}' of ${location}. Make sure to skip the operation if no IDs are provided.`,
                    );
                }

                for (const id of ids) {
                    const row = await repo.findOneOrFail(id, { filters: false }); // disable all default filters, e.g., excludeDeleted
                    if (row.scope) {
                        contentScopes.push([row.scope as ContentScope]);
                    } else {
                        const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>(SCOPED_ENTITY_METADATA_KEY, [affectedEntity.entity]);
                        if (!scoped) {
                            throw new Error(`Entity ${affectedEntity.entity} is missing @ScopedEntity decorator`);
                        }
                        let scopes;
                        if (isScopedEntitySqlResolvable(scoped)) {
                            scopes = resolveScopeFromEntity(scoped, row);
                        } else if (isInjectableService(scoped)) {
                            const service = this.moduleRef.get(scoped, { strict: false });
                            scopes = await service.getEntityScope(row);
                        } else {
                            scopes = await scoped(row);
                        }
                        if (!scopes) {
                            throw new Error(`@ScopedEntity function for ${affectedEntity.entity} didn't return any scopes`);
                        }
                        contentScopes.push(Array.isArray(scopes) ? scopes : [scopes]);
                    }
                }
            }
        } else if (affectedEntity.options.pageTreeNodeIdArg) {
            if (!args[affectedEntity.options.pageTreeNodeIdArg] && !affectedEntity.options.nullable) {
                throw new Error(`${affectedEntity.options.pageTreeNodeIdArg} arg not found`);
            }

            if (args[affectedEntity.options.pageTreeNodeIdArg]) {
                if (this.pageTreeService === undefined) {
                    throw new Error("pageTreeNodeIdArg was given but no PageTreeModule is registered");
                }
                const pageTreeApi = await this.pageTreeService.createReadApi({ visibility: "all" });
                const id = args[affectedEntity.options.pageTreeNodeIdArg];
                const ids = Array.isArray(id) ? id : [id];
                for (const id of ids) {
                    const node = await pageTreeApi.getNode(id);
                    if (!node) {
                        throw new Error("Can't find pageTreeNode");
                    }
                    if (!node.scope) {
                        throw new Error("PageTreeNode doesn't have a scope");
                    }
                    contentScopes.push([node.scope as ContentScope]);
                }
            }
        } else {
            // TODO implement something more flexible that supports something like that: @AffectedEntity(Product, ProductEntityLoader)
            throw new Error("idArg or pageTreeNodeIdArg is required");
        }
        return contentScopes;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async getArgs(context: ExecutionContext): Promise<Record<string, any>> {
        if (context.getType().toString() === "graphql") {
            return GqlExecutionContext.create(context).getArgs();
        } else {
            const request = context.switchToHttp().getRequest();
            return { ...request.params, ...request.query };
        }
    }
}
