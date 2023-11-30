import { ChangeSetType, EntityManager, EntityName, EventSubscriber, FlushEventArgs } from "@mikro-orm/core";
import { Injectable, Type } from "@nestjs/common";

import { DocumentInterface } from "../document/dto/document-interface";
import { AttachedDocument } from "./entities/attached-document.entity";
import { PageTreeService } from "./page-tree.service";
import { PageTreeNodeInterface } from "./types";

export class DocumentSubscriberFactory {
    static create({ Documents }: { Documents: Type<DocumentInterface>[] }): Type<EventSubscriber> {
        @Injectable()
        class DocumentSubscriber implements EventSubscriber<DocumentInterface> {
            constructor(readonly em: EntityManager, private readonly pageTreeService: PageTreeService) {
                em.getEventManager().registerSubscriber(this);
            }

            getSubscribedEntities(): EntityName<DocumentInterface>[] {
                return Documents;
            }

            async onFlush(args: FlushEventArgs): Promise<void> {
                const updateOrCreateChangeSet = args.uow
                    .getChangeSets()
                    .find((changeSet) => changeSet.type === ChangeSetType.CREATE || changeSet.type === ChangeSetType.UPDATE);

                if (updateOrCreateChangeSet) {
                    const pageTreeReadApi = this.pageTreeService.createReadApi({ visibility: "all" });
                    let pageTreeNode: PageTreeNodeInterface | null | undefined;

                    if (Documents.some((document) => updateOrCreateChangeSet.entity instanceof document)) {
                        // Already existing document is updated -> use document to get page tree node
                        pageTreeNode = await pageTreeReadApi.getFirstNodeByAttachedPageId(updateOrCreateChangeSet.entity.id);
                    } else if (updateOrCreateChangeSet.entity instanceof AttachedDocument) {
                        // Document is attached to a page tree node -> use relation entity (AttachedDocument) to get page tree node
                        pageTreeNode = await pageTreeReadApi.getNode(updateOrCreateChangeSet.entity.pageTreeNodeId);
                    }

                    if (pageTreeNode) {
                        pageTreeNode.updatedAt = new Date();
                        args.uow.computeChangeSet(pageTreeNode);
                    }
                }
            }
        }

        return DocumentSubscriber;
    }
}
