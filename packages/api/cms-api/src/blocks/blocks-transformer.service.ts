import { BlockContext, BlockDataInterface } from "@comet/blocks-api";
import { Inject, Injectable, Optional } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { CONTEXT } from "@nestjs/graphql";

import { getRequestContextHeadersFromRequest } from "../common/decorators/request-context.decorator";
import { PageTreeReadApiService } from "../page-tree/page-tree-read-api.service";
import { BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES } from "./blocks.constants";
import { transformToPlain } from "./blocks-transformer";

@Injectable()
export class BlocksTransformerService {
    private blockContext: BlockContext;
    private dependencies: Record<string, unknown>;
    constructor(
        @Inject(BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES) dependencies: Record<string, unknown>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        @Inject(CONTEXT) context: any,
        private readonly moduleRef: ModuleRef,
        @Optional() pageTreeReadApi?: PageTreeReadApiService,
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
        this.dependencies = {
            ...dependencies,
            pageTreeReadApi: pageTreeReadApi,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async transformToPlain(block: BlockDataInterface, context?: BlockContext): Promise<any> {
        return transformToPlain(block, this.dependencies, context ?? this.blockContext, this.moduleRef);
    }
}
