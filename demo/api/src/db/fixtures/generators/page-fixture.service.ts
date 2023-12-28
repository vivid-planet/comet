import { PageTreeNodeInterface, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { Page } from "@src/pages/entities/page.entity";
import { UserGroup } from "@src/user-groups/user-group";
import faker from "faker";
import slugify from "slugify";

import { PageContentBlockFixtureService } from "./blocks/page-content-block-fixture.service";
import { SeoBlockFixtureService } from "./blocks/seo-block-fixture.service";

interface GeneratePageInput {
    name: string;
    scope: PageTreeNodeScope;
    parentId?: string;
    visibility?: PageTreeNodeVisibility;
}

@Injectable()
export class PageFixtureService {
    constructor(
        private readonly pageTreeService: PageTreeService,
        @InjectRepository(Page) private readonly pagesRepository: EntityRepository<Page>,
        private readonly pageContentBlockFixtureService: PageContentBlockFixtureService,
        private readonly seoBlockFixtureService: SeoBlockFixtureService,
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

        const page = this.pagesRepository.create({
            id,
            content: (await this.pageContentBlockFixtureService.generateBlock()).transformToBlockData(),
            seo: (await this.seoBlockFixtureService.generateBlock()).transformToBlockData(),
        });

        await this.pagesRepository.persistAndFlush(page);

        return { node, page };
    }
}
