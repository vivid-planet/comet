import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

import { CurrentUser } from "../../user-permissions/dto/current-user";
import { UserPermissionsService } from "../../user-permissions/user-permissions.service";
import { AuthServiceInterface } from "../util/auth-service.interface";

@Injectable()
export class CometAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly service: UserPermissionsService,
        @Inject("COMET_AUTH_SERVICES") private readonly authServices: AuthServiceInterface[],
    ) {}

    private getRequest(context: ExecutionContext): Request & { user: CurrentUser } {
        return context.getType().toString() === "graphql"
            ? GqlExecutionContext.create(context).getContext().req
            : context.switchToHttp().getRequest();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context);

        const disableCometGuard = this.reflector.getAllAndOverride("disableCometGuards", [context.getHandler(), context.getClass()]);
        const hasIncludeInvisibleContentHeader = !!request.headers["x-include-invisible-content"];
        if (disableCometGuard && !hasIncludeInvisibleContentHeader) {
            return true;
        }

        if (this.isResolvingGraphQLField(context)) {
            return true;
        }

        let user = await this.getAuthenticatedUser(request);
        if (!user) return false;

        if (typeof user === "string") {
            const userId = user;
            const userService = this.service.getUserService();
            if (!userService) throw new UnauthorizedException(`User authenticated by ID but no user service given: ${userId}`);
            try {
                user = await userService.getUser(userId); // TODO Cache this call
            } catch (e) {
                throw new UnauthorizedException(`Could not get user from UserService: ${userId} - ${(e as Error).message}`);
            }
        }

        request["user"] = await this.service.createCurrentUser(user);

        return true;
    }

    private async getAuthenticatedUser(request: Request) {
        for (const authService of this.authServices) {
            const user = await authService.authenticateUser(request);
            if (user) return user;
        }
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
