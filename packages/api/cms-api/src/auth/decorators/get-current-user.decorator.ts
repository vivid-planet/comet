import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { CurrentUserInterface } from "../current-user/current-user";

// Allows injecting Current User into resolvers via `@GetCurrentUser() user: CurrentUserInterface`
export const GetCurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): CurrentUserInterface => {
    if (context.getType().toString() === "graphql") {
        return GqlExecutionContext.create(context).getContext().req.user;
    } else {
        return context.switchToHttp().getRequest().user;
    }
});
