import { EntityClass } from "@mikro-orm/core";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request, Response } from "express";
import multer from "multer";

import { ContentScope } from "../../common/decorators/content-scope.interface";
import { ScopedEntityMeta } from "../../common/decorators/scoped-entity.decorator";
import { ScopeGuard } from "../../content-scope/scope.guard";
import { CurrentUser } from "../current-user";
import { PermissionCheckOptions } from "./permission-check";

@Injectable()
export class UserManagementGuard extends ScopeGuard {
    private async getBody(request: Request): Promise<Record<string, unknown>> {
        const postMulterRequest: Request = await new Promise((resolve, reject) => {
            multer().any()(request, {} as Response, function (err) {
                if (err) reject(err);
                resolve(request);
            });
        });
        return postMulterRequest.body;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicApi = this.reflector.getAllAndOverride("publicApi", [context.getHandler(), context.getClass()]);
        if (isPublicApi) {
            return true;
        }

        const isGraphQL = context.getType().toString() === "graphql";
        const request: Request & { user: CurrentUser | undefined } = isGraphQL
            ? GqlExecutionContext.create(context).getContext().req
            : context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) return false;

        const getScopeFromEntity = async (entityClass: EntityClass<object> & { scope?: ContentScope }, id: string) => {
            const repo = this.orm.em.getRepository<typeof entityClass>(entityClass);
            const entity = await repo.findOneOrFail(id);
            if (entity.scope) return entity.scope;
            const scoped = this.reflector.getAllAndOverride<ScopedEntityMeta>("scopedEntity", [entityClass]);
            if (!scoped) throw new Error(`ScopedEntity decorator is missing in Entity: ${entity.constructor.name}`);
            return scoped.fn(entity);
        };

        const permissionCheck = {
            ...this.reflector.getAllAndOverride<PermissionCheckOptions>("permissionCheck", [context.getClass()]),
            ...this.reflector.getAllAndOverride<PermissionCheckOptions>("permissionCheck", [context.getHandler()]),
        };
        const errorLocation = `${context.getClass().name}::${context.getHandler().name}()`;
        if (Object.keys(permissionCheck).length === 0) throw new Error(`PermissionCheck decorator is missing in ${errorLocation}`);
        const args = isGraphQL ? GqlExecutionContext.create(context).getArgs() : await this.getBody(request);
        if (permissionCheck.isAllowed) {
            return permissionCheck.isAllowed({ args, getScopeFromEntity, user, entityManager: this.orm.em, request });
        } else {
            if (!permissionCheck.allowedForPermissions) throw new Error(`PermissionCheck is missing allowedForPermissions in ${errorLocation}`);
            if (permissionCheck.skipScopeCheck) return permissionCheck.allowedForPermissions.some((permission) => user.isAllowed(permission));

            let contentScope: ContentScope | undefined;
            if (permissionCheck.getScopeFromMeta) {
                contentScope = await permissionCheck.getScopeFromMeta({ args, getScopeFromEntity, user, entityManager: this.orm.em, request });
            } else if (permissionCheck.getScopeFromArgs) {
                contentScope = permissionCheck.getScopeFromArgs(args);
            } else if (args.scope) {
                contentScope = args.scope;
            } else if (args.id && permissionCheck.entityClass) {
                contentScope = await getScopeFromEntity(permissionCheck.entityClass as EntityClass<object>, args.id);
            }

            if (!contentScope) {
                contentScope = await this.inferScopeFromRequest(context);
            }

            if (!contentScope) {
                throw new Error(
                    `Could not get ContentScope. Either implement isAllowed, getScopeFromArgs, getScopeFromMeta or skip scope-check with skipScopeCheck in ${errorLocation}`,
                );
            }

            const isAllowed = permissionCheck.allowedForPermissions.some((permission) => user.isAllowed(permission, contentScope));
            if (!isAllowed) {
                console.log(permissionCheck.allowedForPermissions, contentScope);
                console.log(
                    user.permissions.map((permission) => permission.name),
                    user.contentScopes.map((scope) => ({ scope: scope.scope, values: scope.values.map((value) => value.value) })),
                );
                console.log("permissionCheck", isAllowed);
            }
            return isAllowed;
        }
    }
}
