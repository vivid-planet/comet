import { isBlockDataInterface } from "@comet/blocks-api";
import { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { BlocksTransformerService } from "./blocks-transformer.service";

export class BlocksTransformerMiddlewareFactory {
    static create(blocksTransformerService: BlocksTransformerService): FieldMiddleware {
        return async ({ context }: MiddlewareContext, next: NextFn) => {
            const fieldValue = await next();

            if (isBlockDataInterface(fieldValue)) {
                const { includeInvisibleBlocks, previewDamUrls } = getRequestContextHeadersFromRequest(context.req);

                return blocksTransformerService.transformToPlain(fieldValue, { includeInvisibleContent: includeInvisibleBlocks, previewDamUrls });
            } else {
                return fieldValue;
            }
        };
    }
}
