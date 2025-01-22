import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { SeoBlock } from "@src/documents/pages/blocks/seo.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import slugify from "slugify";

import { BlockCategory, PageContentBlockFixtureService } from "./page-content-block-fixture.service";
import { SeoBlockFixtureService } from "./seo-block-fixture.service";
import { StageBlockFixtureService } from "./stage-block-fixture.service";

interface GeneratePageInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
    category?: PageTreeNodeCategory;
    blockCategory?: BlockCategory;
}

@Injectable()
export class DocumentGeneratorService {
    constructor(
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        private readonly pageContentBlockFixtureService: PageContentBlockFixtureService,
        private readonly stageBlockFixtureService: StageBlockFixtureService,
        private readonly seoBlockFixtureService: SeoBlockFixtureService,
        private readonly entityManager: EntityManager,
    ) {}

    async generatePage({
        name,
        scope,
        parentId,
        category = PageTreeNodeCategory.MainNavigation,
        blockCategory,
    }: GeneratePageInput): Promise<PageTreeNodeInterface> {
        const id = faker.string.uuid();
        const slug = slugify(name.toLowerCase(), { remove: /[*+~.()/'"!:@]/g });

        const node = await this.pageTreeService.createNode(
            {
                name,
                slug,
                attachedDocument: {
                    id,
                    type: "Page",
                },
                parentId,
            },
            category,
            scope,
        );
        await this.pageTreeService.updateNodeVisibility(node.id, PageTreeNodeVisibility.Published);

        await this.entityManager.persistAndFlush(
            this.pagesRepository.create({
                id,
                content: PageContentBlock.blockDataFactory(await this.pageContentBlockFixtureService.generateBlockInput(blockCategory)),
                seo: SeoBlock.blockDataFactory(await this.seoBlockFixtureService.generateBlockInput()),
                stage: StageBlock.blockDataFactory(await this.stageBlockFixtureService.generateBlockInput()),
            }),
        );

        return node;
    }
}
