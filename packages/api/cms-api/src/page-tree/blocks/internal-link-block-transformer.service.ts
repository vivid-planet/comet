import { BlockTransformerServiceInterface } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { PageTreeReadApiService } from "../page-tree-read-api.service";
import type { InternalLinkBlockData } from "./internal-link.block";

type TransformResponse = {
    targetPage: {
        id: string;
        name: string;
        path: string;
        documentType: string;
    } | null;
    targetPageAnchor?: string;
};

@Injectable()
export class InternalLinkBlockTransformerService implements BlockTransformerServiceInterface<InternalLinkBlockData, TransformResponse> {
    constructor(private moduleRef: ModuleRef) {}

    async transformToPlain(block: InternalLinkBlockData) {
        if (!block.targetPageId) {
            return {
                targetPage: null,
            };
        }

        // @nsams: Can't get the PageTreeReadApiService using constructor injection
        const pageTreeReadApiService = await this.moduleRef.resolve(PageTreeReadApiService);

        //TODO do we need createReadApi({ visibility: "all" });?

        const node = await pageTreeReadApiService.getNode(block.targetPageId);

        if (!node) {
            return { targetPage: null };
        }

        return {
            targetPage: {
                id: node.id,
                name: node.name,
                path: await pageTreeReadApiService.nodePath(node),
                documentType: node.documentType,
            },
            targetPageAnchor: block.targetPageAnchor,
        };
    }
}
