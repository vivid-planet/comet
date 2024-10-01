import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { getRequestFromExecutionContext } from "../../common/decorators/utils";
import { ContentScope } from "../interfaces/content-scope.interface";

export const ContentScopes = createParamDecorator((data: unknown, context: ExecutionContext): ContentScope[] | undefined => {
    const request = getRequestFromExecutionContext(context);
    return request.contentScopes;
});
