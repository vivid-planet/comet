import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Link } from "@src/links/entities/link.entity";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { UserGroup } from "@src/user-groups/user-group";
import faker from "faker";
import slugify from "slugify";

import { LinkBlockFixtureService } from "./blocks/link-block-fixture.service";

interface GenerateLinkInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
}

@Injectable()
export class LinkFixtureService {
    constructor(
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Link) private readonly linkRepository: EntityRepository<Link>,
        private readonly linkBlockFixtureService: LinkBlockFixtureService,
    ) {}

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

        const link = this.linkRepository.create({
            id,
            content: (await this.linkBlockFixtureService.generateBlockInput()).transformToBlockData(),
        });
        await this.linkRepository.persistAndFlush(link);

        return { node, link };
    }
}
