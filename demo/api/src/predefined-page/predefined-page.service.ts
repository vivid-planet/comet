import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";

import { PredefinedPage } from "./entities/predefined-page.entity";

@Injectable()
export class PredefinedPageService {
    constructor(
        @InjectRepository(PredefinedPage) private readonly repository: EntityRepository<PredefinedPage>,
        protected readonly pageTreeService: PageTreeService,
    ) {}

    async pageTreeNodeForPredefinedPage(
        type: string,
        scope: PageTreeNodeScope,
        includeInvisiblePages?: Array<PageTreeNodeVisibility.Archived | PageTreeNodeVisibility.Unpublished>,
    ): Promise<PageTreeNodeInterface | null> {
        const predefinedPageNodes = await this.pageTreeService
            .createReadApi({
                visibility: [PageTreeNodeVisibility.Published, ...(includeInvisiblePages || [])],
            })
            .getNodes({ scope, documentType: "PredefinedPage" });

        for (const node of predefinedPageNodes) {
            const attachedDocument = await this.pageTreeService.getActiveAttachedDocument(node.id, node.documentType);

            if (!attachedDocument) {
                continue;
            }

            const document = (await this.pageTreeService.resolveDocument(
                attachedDocument.type,
                attachedDocument.documentId,
            )) as PredefinedPage | null;

            if (!document) {
                continue;
            }

            if (document.type === type) {
                return node;
            }
        }

        return null;
    }
}
