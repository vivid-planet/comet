import { EntityClass, MikroORM } from "@mikro-orm/core";
import { ExecutionContext, Inject, Injectable, Optional } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { CurrentUserInterface } from "../auth/current-user/current-user";
import { ContentScope } from "../common/decorators/content-scope.interface";
import { ScopedEntityMeta } from "../common/decorators/scoped-entity.decorator";
import { SubjectEntityMeta } from "../common/decorators/subject-entity.decorator";
import { PageTreeService } from "../page-tree/page-tree.service";
import { CAN_ACCESS_SCOPE } from "./conent-scope.constants";
import { CanAccessScope } from "./content-scope.module";

@Injectable()
export class ContentScopeService {
    constructor(
        @Inject(CAN_ACCESS_SCOPE) private canAccessScopeConfig: CanAccessScope,
        private reflector: Reflector,
        private readonly orm: MikroORM,
        @Optional() private readonly pageTreeService?: PageTreeService,
    ) {}

    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface): boolean {
        return this.canAccessScopeConfig(requestScope, user);
    }

    async inferScopeFromExecutionContext(context: ExecutionContext): Promise<ContentScope | undefined> {
        if (context.getType().toString() === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            const args = gqlContext.getArgs();

            const subjectEntity = this.reflector.getAllAndOverride<SubjectEntityMeta>("subjectEntity", [context.getHandler(), context.getClass()]);
            if (subjectEntity) {
                let subjectScope: ContentScope | undefined;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const repo = this.orm.em.getRepository<any>(subjectEntity.entity);
                if (subjectEntity.options.idArg) {
                    if (!args[subjectEntity.options.idArg]) {
                        throw new Error(`${subjectEntity.options.idArg} arg not found`);
                    }
                    const row = await repo.findOneOrFail(args[subjectEntity.options.idArg]);
                    if (row.scope) {
                        subjectScope = row.scope;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [subjectEntity.entity as EntityClass<any>]);
                        if (!scoped) {
                            return undefined;
                        }
                        subjectScope = await scoped.fn(row);
                    }
                } else if (subjectEntity.options.pageTreeNodeIdArg && args[subjectEntity.options.pageTreeNodeIdArg]) {
                    if (!args[subjectEntity.options.pageTreeNodeIdArg]) {
                        throw new Error(`${subjectEntity.options.pageTreeNodeIdArg} arg not found`);
                    }
                    if (this.pageTreeService === undefined) {
                        throw new Error("pageTreeNodeIdArg was given but no PageTreeModule is registered");
                    }
                    const node = await this.pageTreeService
                        .createReadApi({ visibility: "all" })
                        .getNode(args[subjectEntity.options.pageTreeNodeIdArg]);
                    if (!node) throw new Error("Can't find pageTreeNode");
                    subjectScope = node.scope;
                } else {
                    // TODO implement something more flexible that supports something like that: @SubjectEntity(Product, ProductEntityLoader)
                    throw new Error("idArg or pageTreeNodeIdArg is required");
                }
                if (subjectScope === undefined) throw new Error("Scope not found");
                if (args.scope) {
                    // args.scope also exists, check if they match
                    if (!isEqual(args.scope, subjectScope)) {
                        throw new Error("Content Scope from arg doesn't match subjectEntity scope, usually you only need one of them");
                    }
                }
                return subjectScope;
            }
            if (args.scope) {
                return args.scope;
            }
        }
        return undefined;
    }
}
