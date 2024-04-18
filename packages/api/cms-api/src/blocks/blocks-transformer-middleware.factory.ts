import { isBlockDataInterface } from "@comet/blocks-api";
import { ModuleRef } from "@nestjs/core";
import { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { transformToPlain } from "./blocks-transformer";

export class BlocksTransformerMiddlewareFactory {
    static create(moduleRef: ModuleRef): FieldMiddleware {
        return async ({ context }: MiddlewareContext, next: NextFn) => {
            const fieldValue = await next();

            if (isBlockDataInterface(fieldValue)) {
                const { includeInvisibleBlocks, previewDamUrls, relativeDamUrls } = getRequestContextHeadersFromRequest(context.req);
                return transformToPlain(fieldValue, { includeInvisibleContent: includeInvisibleBlocks, previewDamUrls, relativeDamUrls }, moduleRef);
            } else {
                return fieldValue;
            }
        };
    }
}
