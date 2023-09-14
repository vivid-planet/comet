import { ExternalLinkBlock } from "@comet/blocks-api";
import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { Link } from "@src/links/entities/link.entity";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import faker from "faker";
import slugify from "slugify";

interface GenerateLinkInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
}

@Injectable()
export class LinkGeneratorService {
    constructor(private readonly pageTreeService: PageTreeService, @InjectRepository(Link) private readonly linkRepository: EntityRepository<Link>) {}

    async generateLink({ name, scope, parentId }: GenerateLinkInput): Promise<PageTreeNodeInterface> {
        const id = faker.datatype.uuid();
        const slug = slugify(name.toLowerCase());

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
