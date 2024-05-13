import { BlockContext, BlockDataInterface } from "@comet/blocks-api";
import { Inject, Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { CONTEXT } from "@nestjs/graphql";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { transformToPlain } from "./blocks-transformer";

@Injectable()
export class BlocksTransformerService {
    private blockContext: BlockContext;

    constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        @Inject(CONTEXT) private readonly context: any,
        private readonly moduleRef: ModuleRef,
    ) {
        let includeInvisibleBlocks: boolean | undefined = false;
        let previewDamUrls = false;
        let relativeDamUrls = false;
        if (context) {
            let headers;
            if (context.req) {
                headers = context.req.headers;
            } else if (context.headers) {
                headers = context.headers;
            } else {
                throw new Error("Can't extract request headers from context");
            }
            const ctx = getRequestContextHeadersFromRequest({ headers });

            includeInvisibleBlocks = ctx.includeInvisibleBlocks;
            previewDamUrls = ctx.previewDamUrls;
            relativeDamUrls = ctx.relativeDamUrls;
        }

        this.blockContext = { includeInvisibleContent: includeInvisibleBlocks, previewDamUrls, relativeDamUrls };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transformToPlain(block: BlockDataInterface, context?: BlockContext): Promise<any> {
        return transformToPlain(block, context ?? this.blockContext, this.moduleRef, this.context);
    }
}
