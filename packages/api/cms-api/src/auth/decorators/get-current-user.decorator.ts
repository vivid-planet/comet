import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { CurrentUserInterface } from "../current-user/current-user";

// Allows injecting Current User into resolvers via `@GetCurrentUser() user: CurrentUserInterface`
export const GetCurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): CurrentUserInterface => {
    let user: CurrentUserInterface;
    if (context.getType().toString() === "graphql") {
        user = GqlExecutionContext.create(context).getContext().req.user;
    } else {
        user = context.switchToHttp().getRequest().user;
    }
    if (!user.permissions) user.permissions = [];
    if (!user.contentScopes) user.contentScopes = [];
    return user;
});
