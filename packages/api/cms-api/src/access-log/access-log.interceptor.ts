import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CurrentUser } from "src/user-permissions/dto/current-user";

/** TODOs
 * Docs are missing
 */
const IGNORED_PATHS = ["/dam/images/:hash/:fileId", "/dam/files/:hash/:fileId", "/dam/images/preview/:fileId", "/dam/files/preview/:fileId"];

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    protected readonly logger = new Logger(AccessLogInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        const requestType = context.getType().toString();

        const requestData: string[] = [];
        let ignored = false;

        if (requestType === "graphql") {
            const graphqlExecutionContext = GqlExecutionContext.create(context);
            const graphqlContext = graphqlExecutionContext.getContext();

            if (graphqlContext.req.headers["authorization"] || graphqlContext.req.headers["Authorization"]) {
                ignored = true;
            }

            requestData.push(`ip: ${graphqlContext.req.ip}`);
            this.pushUserToRequestData(graphqlContext.req.user, requestData);

            const gqlArgs = graphqlExecutionContext.getArgs();
            const gqlInfo = graphqlExecutionContext.getInfo();

            if (gqlInfo.operation.operation === "mutation") {
                delete gqlArgs["input"];
                delete gqlArgs["data"];
            }

            requestData.push(
                ...[
                    `operationType: ${gqlInfo.parentType}`,
                    `operationName: ${gqlInfo.operation.name.value}`,
                    `resolver function: ${gqlInfo.fieldName}`,
                    `args: ${JSON.stringify(gqlArgs)}`,
                ],
            );
        } else {
            const httpContext = context.switchToHttp();
            const httpRequest = httpContext.getRequest();

            if (
                IGNORED_PATHS.some((ignoredPath) => httpRequest.route.path.includes(ignoredPath)) ||
                httpRequest.headers["authorization"] ||
                httpRequest.headers["Authorization"]
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
