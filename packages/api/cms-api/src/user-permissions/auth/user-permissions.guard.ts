import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

import { AccessControlService, AllowedPermission } from "../access-control.service";
import { RequiredPermission } from "../decorators/required-permission.decorator";
import { CurrentUser } from "../dto/current-user";
import { InferScopeService } from "../infer-scope.service";
import { ContentScope } from "../interfaces/content-scope.interface";
import { ACCESS_CONTROL_SERVICE } from "../user-permissions.const";

@Injectable()
export class UserPermissionsGuard implements CanActivate {
    constructor(
        protected reflector: Reflector,
        private readonly inferScopeService: InferScopeService,
        @Inject(ACCESS_CONTROL_SERVICE) private readonly accessControlService: AccessControlService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublicApi = this.reflector.getAllAndOverride("publicApi", [context.getHandler(), context.getClass()]);
        if (isPublicApi) return true;

        const request = this.getRequest(context);
        const user = request.user;
        if (!user) return false;

        const requiredPermission = this.reflector.getAllAndOverride<RequiredPermission>("requiredPermission", [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermission)
            throw new Error(`RequiredPermission decorator is missing in ${context.getClass().name}::${context.getHandler().name}()`);

        let contentScope: ContentScope | undefined;
        if (!requiredPermission.options?.skipScopeCheck) {
            contentScope = await this.inferScopeService.inferScopeFromExecutionContext(context);
            if (!contentScope)
                throw new Error(
                    `Could not get ContentScope. Either add @AffectedContentScope()/@AffectedEntity() decorator or add skipScopeCheck in ${
                        context.getClass().name
                    }::${context.getHandler().name}()`,
                );
        }

        return requiredPermission.requiredPermission.some((permission) =>
            this.accessControlService.isAllowed(user, permission as AllowedPermission, contentScope),
        );
    }

    private getRequest(context: ExecutionContext): Request & { user: CurrentUser | undefined } {
        if (context.getType().toString() === "graphql") {
            return GqlExecutionContext.create(context).getContext().req;
        } else {
            return context.switchToHttp().getRequest();
        }
    }
}
