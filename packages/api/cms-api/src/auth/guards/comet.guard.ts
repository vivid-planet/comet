import { CanActivate, ExecutionContext, Injectable, mixin, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard, IAuthGuard, Type } from "@nestjs/passport";
import { Request } from "express";
import { isObservable, lastValueFrom } from "rxjs";

export function createCometAuthGuard(type?: string | string[]): Type<IAuthGuard> {
    @Injectable()
    class CometAuthGuard extends AuthGuard(type) implements CanActivate {
        constructor(private reflector: Reflector) {
            super();
        }

        getRequest(context: ExecutionContext): Request {
            return context.getType().toString() === "graphql"
                ? GqlExecutionContext.create(context).getContext().req
                : context.switchToHttp().getRequest();
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        handleRequest<CurrentUser>(err: unknown, user: any, info: any): CurrentUser {
            if (err) {
                throw err;
            }
            if (user) {
                return user;
            }
<<<<<<< HEAD
            throw new UnauthorizedException(info[0]?.message);
=======
            throw new HttpException("UNAUTHENTICATED", 401);
>>>>>>> main
        }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const disableCometGuard = this.reflector.getAllAndOverride("disableCometGuards", [context.getHandler(), context.getClass()]);
            const hasIncludeInvisibleContentHeader = !!this.getRequest(context).headers["x-include-invisible-content"];
            if (disableCometGuard && !hasIncludeInvisibleContentHeader) {
                return true;
            }

            if (this.isResolvingGraphQLField(context)) {
                return true;
            }

            const canActivate = await super.canActivate(context);
            return isObservable(canActivate) ? lastValueFrom(canActivate) : canActivate;
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
    return mixin(CometAuthGuard);
}
