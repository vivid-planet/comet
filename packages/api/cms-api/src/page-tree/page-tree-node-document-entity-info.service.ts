import { Injectable } from "@nestjs/common";

import { EntityInfoServiceInterface } from "../common/entityInfo/entity-info.decorator.js";
import { DocumentInterface } from "../document/dto/document-interface.js";
import { PageTreeService } from "./page-tree.service.js";

@Injectable()
export class PageTreeNodeDocumentEntityInfoService implements EntityInfoServiceInterface<DocumentInterface> {
    constructor(private readonly pageTreeService: PageTreeService) {}

    async getEntityInfo(document: DocumentInterface) {
        const pageTreeReadApiService = this.pageTreeService.createReadApi({ visibility: "all" });

        const pageTreeNode = await pageTreeReadApiService.getFirstNodeByAttachedPageId(document.id);

        return {
            name: pageTreeNode?.name ?? "Unknown",
            secondaryInformation: pageTreeNode ? await pageTreeReadApiService.nodePath(pageTreeNode) : undefined,
        };
    }
}
