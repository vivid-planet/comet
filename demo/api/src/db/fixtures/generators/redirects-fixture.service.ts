import {
    AttachedDocument,
    PageTreeNodeVisibility,
    RedirectGenerationType,
    RedirectInterface,
    REDIRECTS_LINK_BLOCK,
    RedirectsLinkBlock,
    RedirectSourceTypeValues,
} from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { SeoBlock } from "@src/documents/pages/blocks/seo.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { UserGroup } from "@src/user-groups/user-group";

import { SeoBlockFixtureService } from "./seo-block-fixture.service";

@Injectable()
export class RedirectsFixtureService {
    constructor(
        @Inject(REDIRECTS_LINK_BLOCK) private readonly redirectsLinkBlock: RedirectsLinkBlock,
        @InjectRepository("Redirect") private readonly redirectsRepository: EntityRepository<RedirectInterface>,
        @InjectRepository(PageTreeNode) private readonly pageTreeNodesRepository: EntityRepository<PageTreeNode>,
        @InjectRepository(AttachedDocument) private readonly attachedDocumentsRepository: EntityRepository<AttachedDocument>,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        private readonly seoBlockFixtureService: SeoBlockFixtureService,
        private readonly entityManager: EntityManager,
    ) {}

    async generateRedirects(): Promise<void> {
        const pages = [];
        const pageTreeNodeIds = [];

        for (let level = 0; level < 10; level++) {
            const pagesForLevel = [];

            for (let i = 0; i < 100; i++) {
                const pageTreeNodeId = faker.string.uuid();
                const pageId = faker.string.uuid();

                this.entityManager.persist(
                    this.pagesRepository.create({
                        id: pageId,
                        content: PageContentBlock.blockInputFactory({ blocks: [] }).transformToBlockData(),
                        stage: StageBlock.blockInputFactory({ blocks: [] }).transformToBlockData(),
                        seo: SeoBlock.blockDataFactory(await this.seoBlockFixtureService.generateBlockInput()),
                    }),
                );
                this.entityManager.persist(
                    this.pageTreeNodesRepository.create({
                        id: pageTreeNodeId,
                        parentId: level > 0 ? faker.helpers.arrayElement(pages[level - 1]) : null,
                        name: `Page ${i}`,
                        slug: `page-${i}`,
                        documentType: "Page",
                        visibility: PageTreeNodeVisibility.Published,
                        scope: { domain: "secondary", language: "en" },
                        userGroup: UserGroup.All,
                        pos: i,
                        category: PageTreeNodeCategory.MainNavigation,
                    }),
                );
                this.entityManager.persist(this.attachedDocumentsRepository.create({ pageTreeNodeId, documentId: pageId, type: "Page" }));

                pagesForLevel.push(pageTreeNodeId);
            }

            pages.push(pagesForLevel);
            pageTreeNodeIds.push(...pagesForLevel);
        }

        for (let i = 0; i < 7000; i++) {
            this.redirectsRepository.create({
                generationType: RedirectGenerationType.manual,
                source: `/redirect-${i}`,
                target: this.redirectsLinkBlock
                    .blockInputFactory({
                        attachedBlocks: [
                            {
                                type: "internal",
                                props: {
                                    targetPageId: faker.helpers.arrayElement(pageTreeNodeIds),
                                },
                            },
                        ],
                        activeType: "internal",
                    })
                    .transformToBlockData(),
                active: true,
                scope: {
                    domain: "secondary",
                },
                sourceType: RedirectSourceTypeValues.path,
            });
        }

        await this.entityManager.flush();
    }
}
