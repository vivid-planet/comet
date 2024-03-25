import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

import { ContentScopeService } from "../content-scope.service";
import { RequiredPermissionMetadata } from "../decorators/required-permission.decorator";
import { CurrentUser } from "../dto/current-user";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions.constants";
import { AccessControlServiceInterface, SystemUser } from "../user-permissions.types";

@Injectable()
export class UserPermissionsGuard implements CanActivate {
    constructor(
        protected reflector: Reflector,
        private readonly contentScopeService: ContentScopeService,
        @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService: AccessControlServiceInterface,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const location = `${context.getClass().name}::${context.getHandler().name}()`;

        if (this.getDecorator(context, "disableCometGuards")) return true;
        if (this.getDecorator(context, "publicApi")) return true;

        const user = this.getUser(context);
        if (!user) return false;

        // System user authenticated via basic auth
        if (user === true) return true;

        const requiredPermission = this.getDecorator<RequiredPermissionMetadata>(context, "requiredPermission");
        if (!requiredPermission && this.isResolvingGraphQLField(context)) return true;
        if (!requiredPermission) throw new Error(`RequiredPermission decorator is missing in ${location}`);
        const requiredPermissions = requiredPermission.requiredPermission;
        if (requiredPermissions.length === 0) throw new Error(`RequiredPermission decorator has empty permissions in ${location}`);
        if (this.isResolvingGraphQLField(context) || requiredPermission.options?.skipScopeCheck) {
            // At least one permission is required
            return requiredPermissions.some((permission) => this.accessControlService.isAllowed(user, permission));
        } else {
            const requiredContentScopes = await this.contentScopeService.getScopesForPermissionCheck(context);
            if (requiredContentScopes.length === 0)
                throw new Error(
                    `Could not get content scope. Either pass a scope-argument or add an @AffectedEntity()-decorator or enable skipScopeCheck in the @RequiredPermission()-decorator of ${location}`,
                );

            // requiredContentScopes is an two level array of scopes
            // The first level has to be checked with AND, the second level with OR
            // The first level consists of submitted scopes and affected entities
            // The only case that there is more than one scope in the second level is when the ScopedEntity returns more scopes
            return requiredPermissions.some((permission) =>
                requiredContentScopes.every((contentScopes) =>
                    contentScopes.some((contentScope) => this.accessControlService.isAllowed(user, permission, contentScope)),
                ),
            );
        }
    }

    private getUser(context: ExecutionContext): CurrentUser | SystemUser | undefined {
        const request =
            context.getType().toString() === "graphql" ? GqlExecutionContext.create(context).getContext().req : context.switchToHttp().getRequest();
        return request.user as CurrentUser | SystemUser | undefined;
    }

    private getDecorator<T = object>(context: ExecutionContext, decorator: string): T {
        return this.reflector.getAllAndOverride(decorator, [context.getClass(), context.getHandler()]);
    }

    // See https://docs.nestjs.com/graphql/other-features#execute-enhancers-at-the-field-resolver-level
    private isResolvingGraphQLField(context: ExecutionContext): boolean {
        if (context.getType<GqlContextType>() === "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            const info = gqlContext.getInfo();
            const parentType = info.parentType.name;
            return parentType !== "Query" && parentType !== "Mutation";
        }
        return false;
    }
}
