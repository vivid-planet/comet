import { EntityVisibilityServiceInterface } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";

import { DocumentInterface } from "../document/dto/document-interface";
import { PageTreeService } from "./page-tree.service";
import { PageTreeNodeVisibility } from "./types";

@Injectable()
export class PageTreeNodeDocumentEntityVisibilityService implements EntityVisibilityServiceInterface<DocumentInterface> {
    constructor(private readonly pageTreeService: PageTreeService) {}

    async getEntityVisibility(document: DocumentInterface) {
        const pageTreeReadApiService = this.pageTreeService.createReadApi({ visibility: PageTreeNodeVisibility.Published });

        const pageTreeNode = await pageTreeReadApiService.getFirstNodeByAttachedPageId(document.id);

        console.log("pageTreeNode ", pageTreeNode);

        return Boolean(pageTreeNode);
    }
}
