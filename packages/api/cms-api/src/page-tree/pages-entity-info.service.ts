import { Injectable } from "@nestjs/common";

import { EntityInfoServiceInterface } from "../dam/files/decorators/entity-info.decorator";
import { DocumentInterface } from "../document/dto/document-interface";
import { PageTreeService } from "./page-tree.service";

@Injectable()
export class PagesEntityInfoService implements EntityInfoServiceInterface<DocumentInterface> {
    constructor(private readonly pageTreeService: PageTreeService) {}

    async getEntityInfo(page: DocumentInterface) {
        const pageTreeReadApiService = this.pageTreeService.createReadApi();

        const pageTreeNode = await pageTreeReadApiService.getFirstNodeByAttachedPageId(page.id);

        return {
            name: pageTreeNode?.name ?? "Unknown",
            secondaryInformation: pageTreeNode ? await pageTreeReadApiService.nodePath(pageTreeNode) : undefined,
        };
    }
}
