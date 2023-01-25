import { File, PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { configNS } from "@src/config/config.namespace";
import { generateBlocksBlock } from "@src/db/fixtures/generators/blocks/blocks.generator";
import { generateSeoBlock } from "@src/db/fixtures/generators/blocks/seo.generator";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { Page } from "@src/pages/entities/page.entity";
import faker from "faker";
import slugify from "slugify";

interface GeneratePageInput {
    name: string;
    scope: PageTreeNodeScope;
    imageFiles: File[];
    parentId?: string;
}

@Injectable()
export class DocumentGeneratorService {
    constructor(
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        @Inject(configNS.KEY) private readonly config: ConfigType<typeof configNS>,
    ) {}

    async generatePage({ name, scope, parentId, imageFiles }: GeneratePageInput): Promise<PageTreeNodeInterface> {
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
        await this.pageTreeService.updateNodeVisibility(node.id, PageTreeNodeVisibility.Published);

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
