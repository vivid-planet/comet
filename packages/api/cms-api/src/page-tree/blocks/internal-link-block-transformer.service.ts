import { BlockTransformerServiceInterface } from "@comet/blocks-api";
import { Injectable, Scope } from "@nestjs/common";

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

@Injectable({ scope: Scope.REQUEST })
export class InternalLinkBlockTransformerService implements BlockTransformerServiceInterface<InternalLinkBlockData, TransformResponse> {
    constructor(private readonly pageTreeReadApiService: PageTreeReadApiService) {}

    async transformToPlain(block: InternalLinkBlockData) {
        if (!block.targetPageId) {
            return {
                targetPage: null,
            };
        }

        //TODO do we need createReadApi({ visibility: "all" });?

        const node = await this.pageTreeReadApiService.getNode(block.targetPageId);

        if (!node) {
            return { targetPage: null };
        }

        return {
            targetPage: {
                id: node.id,
                name: node.name,
                path: await this.pageTreeReadApiService.nodePath(node),
                documentType: node.documentType,
            },
            targetPageAnchor: block.targetPageAnchor,
        };
    }
}
