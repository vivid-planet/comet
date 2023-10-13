import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

import { CurrentUserInterface } from "../../auth/current-user/current-user";
import { ContentScopeService } from "../content-scope.service";
import { SCOPE_GUARD_ACTIVE_METADATA_KEY, ScopeGuardActiveMetadataValue } from "../decorators/scope-guard-active.decorator";
import { CONTENT_SCOPE_SERVICE } from "../user-permissions.constants";

@Injectable()
export class UserPermissionsGuard implements CanActivate {
    constructor(protected reflector: Reflector, @Inject(CONTENT_SCOPE_SERVICE) private readonly contentScopeService: ContentScopeService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicApi = this.reflector.getAllAndOverride("publicApi", [context.getHandler(), context.getClass()]);
        if (isPublicApi) {
            return true;
        }

        const scopeGuardActive = this.reflector.getAllAndOverride<ScopeGuardActiveMetadataValue | undefined>(SCOPE_GUARD_ACTIVE_METADATA_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (scopeGuardActive === false) {
            return true;
        }

        const request =
            context.getType().toString() === "graphql" ? GqlExecutionContext.create(context).getContext().req : context.switchToHttp().getRequest();
        const user = request.user as CurrentUserInterface | undefined;
        if (!user) return true;

        const requestScope = await this.contentScopeService.inferScopeFromExecutionContext(context);
        if (requestScope) {
            return this.contentScopeService.canAccessScope(requestScope, user);
        } else {
            //not a scoped request, open to anyone
        }

        return true;
    }
}
