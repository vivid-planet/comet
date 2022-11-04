import { EntityClass, MikroORM } from "@mikro-orm/core";
import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import isEqual from "lodash.isequal";

import { CurrentUser } from "../auth/dto/current-user";
import { ContentScope } from "../common/decorators/content-scope.interface";
import { ScopedEntityMeta } from "../common/decorators/scoped-entity.decorator";
import { SubjectEntityMeta } from "../common/decorators/subject-entity.decorator";
import { PageTreeService } from "../page-tree/page-tree.service";
import { CAN_ACCESS_SCOPE } from "./conent-scope.constants";

@Injectable()
export class ScopeGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly orm: MikroORM,
        private readonly pageTreeService: PageTreeService,
        @Inject(CAN_ACCESS_SCOPE) private canAccessScope: (requestScope: ContentScope, user: CurrentUser) => boolean,
    ) {}

    async inferScopeFromRequest(context: ExecutionContext): Promise<ContentScope | undefined> {
        if (context.getType().toString() === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            const args = gqlContext.getArgs();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const subjectEntity = this.reflector.getAllAndOverride<SubjectEntityMeta<any>>("subjectEntity", [
                context.getHandler(),
                context.getClass(),
            ]);
            if (subjectEntity) {
                let subjectScope: ContentScope | undefined;
                let row;
                const repo = this.orm.em.getRepository(subjectEntity.entity);
                if (subjectEntity.options.idArg || subjectEntity.options.getEntity) {
                    if (subjectEntity.options.getEntity) {
                        row = await subjectEntity.options.getEntity(repo, args);
                    } else if (subjectEntity.options.idArg) {
                        if (!args[subjectEntity.options.idArg]) {
                            throw new Error(`${subjectEntity.options.idArg} arg not found`);
                        }
                        row = await repo.findOneOrFail(args[subjectEntity.options.idArg]);
                    }
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
                    if (!isEqual(args.scope, JSON.parse(JSON.stringify(subjectScope)))) {
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

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicApi = this.reflector.getAllAndOverride("publicApi", [context.getHandler(), context.getClass()]);
        if (isPublicApi) {
            return true;
        }

        const request =
            context.getType().toString() === "graphql" ? GqlExecutionContext.create(context).getContext().req : context.switchToHttp().getRequest();
        const user = request.user as CurrentUser | undefined;
        if (!user) return true;

        const requestScope = await this.inferScopeFromRequest(context);
        if (requestScope) {
            return this.canAccessScope(requestScope, user);
        } else {
            //not a scoped request, open to anyone
        }

        return true;
    }
}
