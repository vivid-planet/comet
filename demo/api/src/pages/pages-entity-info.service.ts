import { PageTreeService } from "@comet/cms-api";
import { EntityInfoServiceInterface } from "@comet/cms-api/lib/dam/files/decorators/entity-info.decorator";
import { Injectable } from "@nestjs/common";
import { Page } from "@src/pages/entities/page.entity";

@Injectable()
export class PagesEntityInfoService implements EntityInfoServiceInterface<Page> {
    constructor(private readonly pageTreeService: PageTreeService) {}

    async getEntityInfo(page: Page) {
        const pageTreeNode = await this.pageTreeService.createReadApi().getFirstNodeByAttachedPageId(page.id);

        return {
            name: pageTreeNode?.name ?? "Unknown",
            secondaryInformation: pageTreeNode ? await this.pageTreeService.createReadApi().nodePath(pageTreeNode) : undefined,
        };
    }
}
