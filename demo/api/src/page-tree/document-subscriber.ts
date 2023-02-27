import { PageTreeService } from "@comet/cms-api";
import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Link } from "@src/links/entities/link.entity";
import { Page } from "@src/pages/entities/page.entity";
import { PredefinedPage } from "@src/predefined-page/entities/predefined-page.entity";

@Injectable()
export class DocumentSubscriber implements EventSubscriber<Page | Link | PredefinedPage> {
    constructor(em: EntityManager, private readonly pageTreeService: PageTreeService, private readonly orm: MikroORM) {
        em.getEventManager().registerSubscriber(this);
    }
    getSubscribedEntities(): EntityName<Page | Link | PredefinedPage>[] {
        return [Page, Link, PredefinedPage];
    }
    async afterCreate(args: EventArgs<Page | Link | PredefinedPage>): Promise<void> {
        await this.updatePageTreeNode(args.entity);
    }
    async afterUpdate(args: EventArgs<Page | Link | PredefinedPage>): Promise<void> {
        await this.updatePageTreeNode(args.entity);
    }

    @UseRequestContext()
    private async updatePageTreeNode(document: Page | Link | PredefinedPage): Promise<void> {
        const pageTreeReadApi = this.pageTreeService.createReadApi();
        const pageTreeNode = await pageTreeReadApi.getFirstNodeByAttachedPageId(document.id);

        if (pageTreeNode) {
            await this.pageTreeService.updateNodeUpdateTime(pageTreeNode.id);
        }
    }
}
