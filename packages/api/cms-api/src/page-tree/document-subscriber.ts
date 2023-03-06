import { EntityManager, EntityName, EventArgs, EventSubscriber, MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Injectable, Type } from "@nestjs/common";

import { DocumentInterface } from "../document/dto/document-interface";
import { PageTreeService } from "./page-tree.service";

export class DocumentSubscriberFactory {
    static create({ Documents }: { Documents: Type<DocumentInterface>[] }): Type<EventSubscriber> {
        @Injectable()
        class DocumentSubscriber implements EventSubscriber<DocumentInterface> {
            constructor(readonly em: EntityManager, private readonly pageTreeService: PageTreeService, private readonly orm: MikroORM) {
                em.getEventManager().registerSubscriber(this);
            }
            getSubscribedEntities(): EntityName<DocumentInterface>[] {
                return Documents;
            }
            async afterCreate(args: EventArgs<DocumentInterface>): Promise<void> {
                await this.updatePageTreeNode(args.entity);
            }
            async afterUpdate(args: EventArgs<DocumentInterface>): Promise<void> {
                await this.updatePageTreeNode(args.entity);
            }

            @UseRequestContext()
            private async updatePageTreeNode(document: DocumentInterface): Promise<void> {
                const pageTreeReadApi = this.pageTreeService.createReadApi({ visibility: "all" });
                const pageTreeNode = await pageTreeReadApi.getFirstNodeByAttachedPageId(document.id);

                if (pageTreeNode) {
                    await pageTreeNode.assign({ ...pageTreeNode, updatedAt: new Date() });
                    await this.em.flush();
                }
            }
        }
        return DocumentSubscriber;
    }
}
