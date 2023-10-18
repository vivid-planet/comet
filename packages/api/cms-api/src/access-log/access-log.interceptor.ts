import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { CurrentUser } from "src/user-permissions/dto/current-user";

/** TODOs
 * Docs are missing
 * Changelog
 * Api password check
 */
const IGNORED_PATHS = ["/dam/images/:hash/:fileId", "/dam/files/:hash/:fileId", "/dam/images/preview/:fileId", "/dam/files/preview/:fileId"];

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    protected readonly logger = new Logger(AccessLogInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        const requestType = context.getType().toString();

        let message = "";
        const additionalRequestData: string[] = [];
        let ignored = false;

        if (requestType === "graphql") {
            const graphqlExecutionContext = GqlExecutionContext.create(context);
            const graphqlContext = graphqlExecutionContext.getContext();

            additionalRequestData.push(`ip: ${graphqlContext.req.ip}`);
            this.pushUserToRequestData(graphqlContext.req.user, additionalRequestData);

            const gqlArgs = graphqlExecutionContext.getArgs();
            const gqlInfo = graphqlExecutionContext.getInfo();

            if (gqlInfo.operation.operation === "mutation") {
                delete gqlArgs["input"];
                delete gqlArgs["data"];
            }

            message = `operationType: ${gqlInfo.parentType} - operationName: ${gqlInfo.operation.name.value} - resolver function: ${
                gqlInfo.fieldName
            } - args: ${JSON.stringify(gqlArgs)}`;
        } else {
            const httpContext = context.switchToHttp();
            const httpRequest = httpContext.getRequest();

            if (IGNORED_PATHS.some((ignoredPath) => httpRequest.route.path.includes(ignoredPath))) {
                ignored = true;
            }

            additionalRequestData.push(`ip: ${httpRequest.ip}`);
            this.pushUserToRequestData(httpRequest.user, additionalRequestData);

            message = `method: ${httpRequest.method} - route: ${httpRequest.route.path} - params: ${JSON.stringify(httpRequest.params)}`;
        }
        if (!ignored) {
            this.logger.log(`Request type: ${requestType} {${additionalRequestData.join(" - ")}} - ${message}`);
        }

        return next.handle();
    }

    private pushUserToRequestData(user: CurrentUser, additionalRequestData: string[]) {
        if (user) {
            additionalRequestData.push(`user: ${user.id} (${user.name})`);
        }
    }
}
