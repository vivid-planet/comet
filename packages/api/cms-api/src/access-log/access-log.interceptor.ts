import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/** TODOs
 * Docs are missing
 * Changelog
 * Api password check
 */
const DAM_IMAGE_PATH = "/dam/images/:hash/:fileId";
const DAM_FILE_PATH = "/dam/files/:hash/:fileId";

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    protected readonly logger = new Logger(AccessLogInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler) {
        const requestType = context.getType().toString();

        let message = "";
        const additionalRequestData = [];
        let ignored = false;

        if (requestType === "graphql") {
            const graphqlExecutionContext = GqlExecutionContext.create(context);
            const graphqlContext = graphqlExecutionContext.getContext();

            additionalRequestData.push(`ip: ${graphqlContext.req.ip}`);
            const user = graphqlContext.req.user;
            if (user) {
                additionalRequestData.push(`user: ${user.id} (${user.name})`);
            }

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

            if (httpRequest.route.path.includes(DAM_IMAGE_PATH) || httpRequest.route.path.includes(DAM_FILE_PATH)) {
                ignored = true;
            }

            additionalRequestData.push(`ip: ${httpRequest.ip}`);
            const user = httpRequest.user;
            if (user) {
                additionalRequestData.push(`user: ${user.id} (${user.name})`);
            }

            message = `method: ${httpRequest.method} - route: ${httpRequest.route.path} - params: ${JSON.stringify(httpRequest.params)}`;
        }
        if (!ignored) {
            this.logger.log(`Request type: ${requestType} {${additionalRequestData.join(" - ")}} - ${message}`);
        }

        return next.handle();
    }
}
