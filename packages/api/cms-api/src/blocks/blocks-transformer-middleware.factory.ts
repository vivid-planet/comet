import { isBlockDataInterface } from "@comet/blocks-api";
import { ModuleRef } from "@nestjs/core";
import { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { PageTreeService } from "../page-tree/page-tree.service";
import { PageTreeNodeVisibility } from "../page-tree/types";
import { transformToPlain } from "./blocks-transformer";

export class BlocksTransformerMiddlewareFactory {
    static create(dependencies: Record<string, unknown>, moduleRef: ModuleRef): FieldMiddleware {
        return async ({ context }: MiddlewareContext, next: NextFn) => {
            const fieldValue = await next();

            if (isBlockDataInterface(fieldValue)) {
                const { includeInvisibleBlocks, previewDamUrls, relativeDamUrls, includeInvisiblePages } = getRequestContextHeadersFromRequest(
                    context.req,
                );
                return transformToPlain(
                    fieldValue,
                    {
                        ...dependencies,
                        pageTreeReadApi: (dependencies.pageTreeService as PageTreeService).createReadApi({
                            visibility: [PageTreeNodeVisibility.Published, ...(includeInvisiblePages || [])],
                        }),
                    },
                    { includeInvisibleContent: includeInvisibleBlocks, previewDamUrls, relativeDamUrls },
                    moduleRef,
                );
            } else {
                return fieldValue;
            }
        };
    }
}
