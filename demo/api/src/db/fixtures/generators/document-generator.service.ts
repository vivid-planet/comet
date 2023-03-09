import { ExternalLinkBlock } from "@comet/blocks-api";
import { File, PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { generateBlocksBlock } from "@src/db/fixtures/generators/blocks/blocks.generator";
import { generateSeoBlock } from "@src/db/fixtures/generators/blocks/seo.generator";
import { Link } from "@src/links/entities/link.entity";
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
        @Inject(CONFIG) private readonly config: Config,
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        @InjectRepository(Link) private readonly linkRepository: EntityRepository<Link>,
    ) {}

    async generatePage({ name, scope, parentId, imageFiles }: GeneratePageInput): Promise<PageTreeNodeInterface> {
        const id = faker.datatype.uuid();
        const slug = slugify(name.toLowerCase());
        console.log("slugPage", slug);

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

    async generateLink({ name, scope, parentId }: GeneratePageInput): Promise<PageTreeNodeInterface> {
        const id = faker.datatype.uuid();
        const slug = slugify(name.toLowerCase());
        console.log("slugLink", slug);

        const node = await this.pageTreeService.createNode(
            {
                name,
                slug,
                attachedDocument: {
                    id,
                    type: "Link",
                },
                parentId,
            },
            PageTreeNodeCategory.MainNavigation,
            scope,
        );
        await this.pageTreeService.updateNodeVisibility(node.id, PageTreeNodeVisibility.Published);

        // TODO: Put in own file, link-block.generator that handles the different link types (external, internal, news)
        const externalLinkUrls = ["https://vivid-planet.com/", "https://github.com/", "https://gitlab.com", "https://stackoverflow.com/"];
        const content = LinkBlock.blockInputFactory({
            attachedBlocks: [
                {
                    type: "external",
                    props: ExternalLinkBlock.blockDataFactory({
                        targetUrl: faker.random.arrayElement(externalLinkUrls),
                        openInNewWindow: faker.datatype.boolean(),
                    }),
                },
            ],
            activeType: "external",
        });

        await this.linkRepository.persistAndFlush(
            this.linkRepository.create({
                id,
                content: content.transformToBlockData(),
            }),
        );

        return node;
    }
}
