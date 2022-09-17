import { CurrentUser, PageTreeService, ScopedEntityMeta, SubjectEntityMeta } from "@comet/cms-api";
import { EntityClass, MikroORM } from "@mikro-orm/core";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GlobalScopeGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly orm: MikroORM, private readonly pageTreeService: PageTreeService) {}

    async inferScopeFromRequest(context: ExecutionContext): Promise<Record<string, string> | undefined> {
        if (context.getType().toString() === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            const args = gqlContext.getArgs();

            const subjectEntity = this.reflector.getAllAndOverride<SubjectEntityMeta>("subjectEntity", [context.getHandler(), context.getClass()]);
            if (subjectEntity) {
                let subjectScope: Record<string, string> | undefined;
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
                        const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scoped", [subjectEntity.entity as EntityClass<any>]);
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
                    if (
                        !Array.from(new Set([...Object.keys(args.scope), ...Object.keys(subjectScope)])).every(
                            (key) => args.scope[key] === subjectScope?.[key],
                        )
                    ) {
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
        if (user.contentScopes === undefined) return true; //user has no contentScope restriction

        const requestScope = await this.inferScopeFromRequest(context);
        if (requestScope) {
            const canAccessScope = user.contentScopes.some((userScope) => {
                return Object.entries(userScope).every(([scopeKey, scopeValue]) => {
                    return !requestScope[scopeKey] || requestScope[scopeKey] == scopeValue;
                });
            });
            // console.log(user.contentScopes, requestScope, canAccessScope);
            if (!canAccessScope) {
                return false;
            }
        } else {
            //not a scoped request, open to anyone
        }

        return true;
    }
}
