import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor, Optional } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql";

import { CurrentUser } from "../user-permissions/dto/current-user";
import { SHOULD_LOG_REQUEST } from "./access-log.constants";
import { ShouldLogRequest } from "./access-log.module";

const IGNORED_PATHS = ["/dam/images/:hash/:fileId", "/dam/files/:hash/:fileId", "/dam/images/preview/:fileId", "/dam/files/preview/:fileId"];

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    protected readonly logger = new Logger(AccessLogInterceptor.name);

    constructor(@Optional() @Inject(SHOULD_LOG_REQUEST) private readonly shouldLogRequest?: ShouldLogRequest) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const requestType = context.getType().toString();

        const requestData: string[] = [];
        let ignored = false;

        if (requestType === "graphql") {
            const graphqlExecutionContext = GqlExecutionContext.create(context);
            const graphqlContext = graphqlExecutionContext.getContext();

            if (
                this.shouldLogRequest &&
                !this.shouldLogRequest({
                    user: graphqlContext.req.user,
                    req: graphqlContext.req,
                })
            ) {
                ignored = true;
            }

            requestData.push(`ip: ${graphqlContext.req.ip}`);
            this.pushUserToRequestData(graphqlContext.req.user, requestData);

            const gqlArgs = { ...graphqlExecutionContext.getArgs() };
            const gqlInfo = graphqlExecutionContext.getInfo<GraphQLResolveInfo>();

            if (gqlInfo.operation.operation === "mutation") {
                delete gqlArgs["input"];
                delete gqlArgs["data"];
            }

            requestData.push(`operationType: ${gqlInfo.parentType}`);
            if (gqlInfo.operation.name?.value) requestData.push(`operationName: ${gqlInfo.operation.name.value}`);
            requestData.push(`resolver function: ${gqlInfo.fieldName}`);
            requestData.push(`args: ${JSON.stringify(gqlArgs)}`);
        } else {
            const httpContext = context.switchToHttp();
            const httpRequest = httpContext.getRequest();

            if (
                IGNORED_PATHS.some((ignoredPath) => httpRequest.route.path.includes(ignoredPath)) ||
                (this.shouldLogRequest &&
                    !this.shouldLogRequest({
                        user: httpRequest.user,
                        req: httpRequest,
                    }))
            ) {
                ignored = true;
            }

            requestData.push(`ip: ${httpRequest.ip}`);
            this.pushUserToRequestData(httpRequest.user, requestData);

            requestData.push(
                ...[`method: ${httpRequest.method}`, `route: ${httpRequest.route.path}`, `params: ${JSON.stringify(httpRequest.params)}`],
            );
        }

        if (!ignored) {
            this.logger.log(`Request type: ${requestType} | ${requestData.join(" | ")}`);
        }

        return next.handle();
    }

    private pushUserToRequestData(user: CurrentUser, requestData: string[]) {
        if (user) {
            requestData.push(`user: ${user.id} (${user.name})`);
        }
    }
}
