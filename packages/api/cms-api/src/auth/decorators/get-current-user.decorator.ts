import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { CurrentUser } from "../../user-permissions/dto/current-user";

// Allows injecting Current User into resolvers via `@GetCurrentUser() user: CurrentUser`
export const GetCurrentUser = createParamDecorator((data: unknown, context: ExecutionContext): CurrentUser => {
    if (context.getType().toString() === "graphql") {
        return GqlExecutionContext.create(context).getContext().req.user;
    } else {
        return context.switchToHttp().getRequest().user;
    }
});
