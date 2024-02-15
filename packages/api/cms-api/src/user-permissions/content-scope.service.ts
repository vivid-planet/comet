import { EntityClass, MikroORM } from "@mikro-orm/core";
import { ExecutionContext, Injectable, Optional } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { PageTreeService } from "../page-tree/page-tree.service";
import { ScopedEntityMeta } from "../user-permissions/decorators/scoped-entity.decorator";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { AffectedArgSelector } from "./decorators/affected-arg.decorator";
import { AffectedEntityMeta } from "./decorators/affected-entity.decorator";

@Injectable()
export class ContentScopeService {
    constructor(private reflector: Reflector, private readonly orm: MikroORM, @Optional() private readonly pageTreeService?: PageTreeService) {}

    scopesAreEqual(scope1: ContentScope | undefined, scope2: ContentScope | undefined): boolean {
        // The scopes are cloned because they could be
        //   - an instance of a class (e.g. DamScope)
        //   - or a plain object (from a GraphQL input)
        // Then they are not deeply equal, although they represent the same scope
        return isEqual({ ...scope1 }, { ...scope2 });
    }

    async inferScopeFromExecutionContext(context: ExecutionContext): Promise<ContentScope | undefined> {
        const args = await this.getArgs(context);

        const affectedEntity = this.reflector.getAllAndOverride<AffectedEntityMeta>("affectedEntity", [context.getHandler(), context.getClass()]);
        if (affectedEntity) {
            let contentScope: ContentScope | undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const repo = this.orm.em.getRepository<any>(affectedEntity.entity);
            if (affectedEntity.options.idArg) {
                if (!args[affectedEntity.options.idArg]) {
                    throw new Error(`${affectedEntity.options.idArg} arg not found`);
                }
                const row = await repo.findOneOrFail(args[affectedEntity.options.idArg]);
                if (row.scope) {
                    contentScope = row.scope;
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [
                        affectedEntity.entity as EntityClass<unknown>,
                    ]);
                    if (!scoped) {
                        return undefined;
                    }
                    contentScope = await scoped.fn(row);
                }
            } else if (affectedEntity.options.pageTreeNodeIdArg && args[affectedEntity.options.pageTreeNodeIdArg]) {
                if (!args[affectedEntity.options.pageTreeNodeIdArg]) {
                    throw new Error(`${affectedEntity.options.pageTreeNodeIdArg} arg not found`);
                }
                if (this.pageTreeService === undefined) {
                    throw new Error("pageTreeNodeIdArg was given but no PageTreeModule is registered");
                }
                const node = await this.pageTreeService.createReadApi({ visibility: "all" }).getNode(args[affectedEntity.options.pageTreeNodeIdArg]);
                if (!node) throw new Error("Can't find pageTreeNode");
                contentScope = node.scope;
            } else {
                // TODO implement something more flexible that supports something like that: @AffectedEntity(Product, ProductEntityLoader)
                throw new Error("idArg or pageTreeNodeIdArg is required");
            }
            if (contentScope === undefined) throw new Error("Scope not found");
            if (args.scope) {
                // args.scope also exists, check if they match
                if (!isEqual(args.scope, contentScope)) {
                    throw new Error("Content Scope from arg doesn't match affectedEntity scope, usually you only need one of them");
                }
            }
            return contentScope;
        }

        const affectedArg = this.reflector.getAllAndOverride<AffectedArgSelector>("affectedArg", [context.getHandler(), context.getClass()]);
        if (affectedArg) {
            if (typeof affectedArg === "function") {
                return affectedArg(args);
            }
            return args[affectedArg];
        }

        if (args.scope) {
            return args.scope;
        }
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
