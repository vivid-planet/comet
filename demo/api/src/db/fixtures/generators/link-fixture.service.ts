import { ExternalLinkBlock } from "@comet/blocks-api";
import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/linkBlock/link.block";
import { Link } from "@src/links/entities/link.entity";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { UserGroup } from "@src/user-groups/user-group";
import faker from "faker";
import slugify from "slugify";

interface GenerateLinkInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
}

@Injectable()
export class LinkFixtureService {
    constructor(private readonly pageTreeService: PageTreeService, @InjectRepository(Link) private readonly linkRepository: EntityRepository<Link>) {}

    async generateLink({ name, scope, parentId }: GenerateLinkInput): Promise<{ node: PageTreeNodeInterface; link: Link }> {
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
                // @ts-expect-error Typing of PageTreeService is wrong https://github.com/vivid-planet/comet/pull/1515#issue-2042001589
                userGroup: UserGroup.All,
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

        const link = this.linkRepository.create({
            id,
            content: content.transformToBlockData(),
        });
        await this.linkRepository.persistAndFlush(link);

        return { node, link };
    }
}
