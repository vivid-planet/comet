import { MikroORM } from "@mikro-orm/core";
import { ExecutionContext, Injectable, Optional, Type } from "@nestjs/common";
import { INJECTABLE_WATERMARK } from "@nestjs/common/constants";
import { ModuleRef, Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { PageTreeService } from "../page-tree/page-tree.service";
import { EntityScopeServiceInterface, ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { AffectedEntityMeta } from "./decorators/affected-entity.decorator";

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

        const affectedEntities = this.reflector.getAllAndOverride<AffectedEntityMeta[]>("affectedEntities", [context.getHandler()]) || [];
        for (const affectedEntity of affectedEntities) {
            contentScopes.push(...(await this.getContentScopesFromEntity(affectedEntity, args)));
        }
        if (args.scope) {
            contentScopes.push([args.scope as ContentScope]);
        }
        return contentScopes;
    }

    async inferScopesFromExecutionContext(context: ExecutionContext): Promise<ContentScope[]> {
        return [...new Set((await this.getScopesForPermissionCheck(context)).flat())];
    }

    private async getContentScopesFromEntity(affectedEntity: AffectedEntityMeta, args: Record<string, string>): Promise<ContentScope[][]> {
        const contentScopes: ContentScope[][] = [];
        if (affectedEntity.options.idArg) {
            if (!args[affectedEntity.options.idArg] && !affectedEntity.options.nullable) {
                throw new Error(`${affectedEntity.options.idArg} arg not found`);
            }

            if (args[affectedEntity.options.idArg]) {
                const repo = this.orm.em.getRepository<{ scope?: ContentScope }>(affectedEntity.entity);
                const id = args[affectedEntity.options.idArg];
                const ids = Array.isArray(id) ? id : [id];
                for (const id of ids) {
                    const row = await repo.findOneOrFail(id);
                    if (row.scope) {
                        contentScopes.push([row.scope as ContentScope]);
                    } else {
                        const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [affectedEntity.entity]);
                        if (!scoped) throw new Error(`Entity ${affectedEntity.entity} is missing @ScopedEntity decorator`);
                        let scopes;
                        if (this.isService(scoped)) {
                            const service = this.moduleRef.get(scoped, { strict: false });
                            scopes = await service.getEntityScope(row);
                        } else {
                            scopes = await scoped(row);
                        }
                        if (!scopes) throw new Error(`@ScopedEntity function for ${affectedEntity.entity} didn't return any scopes`);
                        contentScopes.push(Array.isArray(scopes) ? scopes : [scopes]);
                    }
                }
            }
        } else if (affectedEntity.options.pageTreeNodeIdArg) {
            if (!args[affectedEntity.options.pageTreeNodeIdArg] && !affectedEntity.options.nullable)
                throw new Error(`${affectedEntity.options.pageTreeNodeIdArg} arg not found`);

            if (args[affectedEntity.options.pageTreeNodeIdArg]) {
                if (this.pageTreeService === undefined) throw new Error("pageTreeNodeIdArg was given but no PageTreeModule is registered");
                const pageTreeApi = await this.pageTreeService.createReadApi({ visibility: "all" });
                const id = args[affectedEntity.options.pageTreeNodeIdArg];
                const ids = Array.isArray(id) ? id : [id];
                for (const id of ids) {
                    const node = await pageTreeApi.getNode(id);
                    if (!node) throw new Error("Can't find pageTreeNode");
                    if (!node.scope) throw new Error("PageTreeNode doesn't have a scope");
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

    private isService(meta: ScopedEntityMeta): meta is Type<EntityScopeServiceInterface> {
        // Check if class has @Injectable() decorator -> if true it's a service class else it's a function
        return Reflect.hasMetadata(INJECTABLE_WATERMARK, meta);
    }
}
