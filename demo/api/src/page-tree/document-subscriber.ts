import { PageTreeService } from "@comet/cms-api";
import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Page } from "@src/pages/entities/page.entity";

@Injectable()
export class DocumentSubscriber implements EventSubscriber<Page> {
    constructor(em: EntityManager, private readonly pageTreeService: PageTreeService, private readonly orm: MikroORM) {
        em.getEventManager().registerSubscriber(this);
    }
    getSubscribedEntities(): EntityName<Page>[] {
        return [Page];
    }
    async afterCreate(args: EventArgs<Page>): Promise<void> {
        await this.updatePageTreeNode(args.entity);
    }
    async afterUpdate(args: EventArgs<Page>): Promise<void> {
        await this.updatePageTreeNode(args.entity);
    }

    @UseRequestContext()
    private async updatePageTreeNode(page: Page): Promise<void> {
        const pageTreeReadApi = this.pageTreeService.createReadApi();
        const pageTreeNode = await pageTreeReadApi.getFirstNodeByAttachedPageId(page.id);

        if (pageTreeNode) {
            await this.pageTreeService.updateNodeUpdateTime(pageTreeNode.id);
        }
    }
}
