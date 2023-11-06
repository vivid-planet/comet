import { Injectable } from "@nestjs/common";

import { EntityInfoServiceInterface } from "../dam/files/decorators/entity-info.decorator";
import { DocumentInterface } from "../document/dto/document-interface";
import { PageTreeReadApiService } from "./page-tree-read-api.service";

@Injectable()
export class PagesEntityInfoService implements EntityInfoServiceInterface<DocumentInterface> {
    constructor(private readonly pageTreeReadApiService: PageTreeReadApiService) {}

    async getEntityInfo(page: DocumentInterface) {
        const pageTreeNode = await this.pageTreeReadApiService.getFirstNodeByAttachedPageId(page.id);

        return {
            name: pageTreeNode?.name ?? "Unknown",
            secondaryInformation: pageTreeNode ? await this.pageTreeReadApiService.nodePath(pageTreeNode) : undefined,
        };
    }
}
