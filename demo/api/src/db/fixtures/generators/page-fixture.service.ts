import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { generateSeoBlock } from "@src/db/fixtures/generators/blocks/seo.generator";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { Page } from "@src/pages/entities/page.entity";
import { UserGroup } from "@src/user-groups/user-group";
import faker from "faker";
import slugify from "slugify";

import { generateBlocksBlock } from "./blocks/blocks.generator";
import { ImageFixtureService } from "./image-fixture.service";

interface GeneratePageInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
    visibility?: PageTreeNodeVisibility;
}

@Injectable()
export class PageFixtureService {
    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        private readonly imageFixtureService: ImageFixtureService,
    ) {}

    async generatePage({ name, scope, parentId, visibility }: GeneratePageInput): Promise<{ node: PageTreeNodeInterface; page: Page }> {
        const id = faker.datatype.uuid();
        const slug = slugify(name.toLowerCase());

        const node = await this.pageTreeService.createNode(
            {
                name,
                slug,
                attachedDocument: {
                    id,
                    type: "Page",
                },
                parentId,
                // @ts-expect-error Typing of PageTreeService is wrong https://github.com/vivid-planet/comet/pull/1515#issue-2042001589
                userGroup: UserGroup.All,
            },
            PageTreeNodeCategory.MainNavigation,
            scope,
        );
        await this.pageTreeService.updateNodeVisibility(node.id, visibility ?? PageTreeNodeVisibility.Published);

        const imageFiles = [
            this.imageFixtureService.getRandomImage(),
            this.imageFixtureService.getRandomImage(),
            this.imageFixtureService.getRandomImage(),
        ]; // TODO: remove imageFiles here and put into block that needs an image when it is possible to inject imageGeneratorService directly in a block

        const page = this.pagesRepository.create({
            id,
            content: generateBlocksBlock(imageFiles, this.config).transformToBlockData(),
            seo: generateSeoBlock().transformToBlockData(),
        });

        await this.pagesRepository.persistAndFlush(page);

        return { node, page };
    }
}
