import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

export const getRequestFromExecutionContext = (ctx: ExecutionContext): Request => {
    if (ctx.getType().toString() === "graphql") {
        return GqlExecutionContext.create(ctx).getContext().req;
    }

    return ctx.switchToHttp().getRequest();
};
