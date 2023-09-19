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
import faker from "faker";
import slugify from "slugify";

import { generateBlocksBlock } from "./blocks/blocks.generator";
import { ImageGeneratorService } from "./image-generator.service";

interface GeneratePageInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
    visibility?: PageTreeNodeVisibility;
}

@Injectable()
export class PageGeneratorService {
    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        private readonly imageGeneratorService: ImageGeneratorService,
    ) {}

    async generatePage({ name, scope, parentId, visibility }: GeneratePageInput): Promise<PageTreeNodeInterface> {
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
            },
            PageTreeNodeCategory.MainNavigation,
            scope,
        );
        await this.pageTreeService.updateNodeVisibility(node.id, visibility ?? PageTreeNodeVisibility.Published);

        const imageFiles = [
            this.imageGeneratorService.getRandomImage(),
            this.imageGeneratorService.getRandomImage(),
            this.imageGeneratorService.getRandomImage(),
        ]; // TODO: remove imageFiles here and put into block that needs an image when it is possible to inject imageGeneratorService directly in a block
        await this.pagesRepository.persistAndFlush(
            this.pagesRepository.create({
                id,
                content: generateBlocksBlock(imageFiles, this.config).transformToBlockData(),
                seo: generateSeoBlock().transformToBlockData(),
            }),
        );

        return node;
    }
}
