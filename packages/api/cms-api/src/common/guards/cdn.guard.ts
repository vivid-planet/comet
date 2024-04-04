import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

@Injectable()
export class CdnGuard implements CanActivate {
    private headerName: string;
    private headerValue: string;

    constructor({ headerName, headerValue }: { headerName: string; headerValue: string }) {
        this.headerName = headerName;
        this.headerValue = headerValue;
    }

    private isInternalRequest(request: Request): boolean {
        // This check is only ok when the application is behind a trusted proxy
        return !request.header("x-forwarded-for");
    }

    getRequest(context: ExecutionContext): Request {
        return context.getType().toString() === "graphql"
            ? GqlExecutionContext.create(context).getContext().req
            : context.switchToHttp().getRequest();
    }

    canActivate(context: ExecutionContext): boolean {
        const request = this.getRequest(context);
        if (this.isInternalRequest(request)) {
            // Internal requests (e.g. BFF) are allowed
            return true;
        }

        return request.header(this.headerName) === this.headerValue;
    }
}
