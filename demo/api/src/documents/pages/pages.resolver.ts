import {
    AffectedEntity,
    PageTreeNodeInterface,
    PageTreeNodeVisibility,
    PageTreeService,
    RequiredPermission,
    validateNotModified,
} from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";

import { PageInput } from "./dto/page.input";
import { Page } from "./entities/page.entity";

@Resolver(() => Page)
@RequiredPermission(["pageTree"])
export class PagesResolver {
    constructor(
        @InjectRepository(Page) private readonly repository: EntityRepository<Page>,
        private readonly pageTreeService: PageTreeService,
        private readonly entityManager: EntityManager,
    ) {}

    @Query(() => Page)
    @AffectedEntity(Page)
    async page(@Args("id", { type: () => ID }) id: string): Promise<Page> {
        return this.repository.findOneOrFail({ id });
    }

    @ResolveField(() => PageTreeNode, { nullable: true })
    async pageTreeNode(@Parent() page: Page): Promise<PageTreeNodeInterface | null> {
        return this.pageTreeService.createReadApi({ visibility: "all" }).getFirstNodeByAttachedPageId(page.id);
    }

    @Mutation(() => Page)
    @AffectedEntity(Page, { pageTreeNodeIdArg: "attachedPageTreeNodeId" })
    async savePage(
        @Args("pageId", { type: () => ID }) pageId: string,
        @Args("input", { type: () => PageInput }) input: PageInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
        @Args("attachedPageTreeNodeId", { nullable: true, type: () => ID }) attachedPageTreeNodeId?: string,
    ): Promise<Page | null> {
        // all pageTypes need this is-archived-page-check
        if (attachedPageTreeNodeId) {
            const pageTreeNode = await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(attachedPageTreeNodeId);
            if (pageTreeNode.visibility === PageTreeNodeVisibility.Archived) {
                throw new UnauthorizedException("Archived pages cannot be updated");
            }
        }

        let page = await this.repository.findOne(pageId);

        if (page) {
            if (lastUpdatedAt) {
                validateNotModified(page, lastUpdatedAt);
            }

            page.assign({
                content: input.content.transformToBlockData(),
                seo: input.seo.transformToBlockData(),
                stage: input.stage.transformToBlockData(),
            });
        } else {
            page = this.repository.create({
                id: pageId,
                content: input.content.transformToBlockData(),
                seo: input.seo.transformToBlockData(),
                stage: input.stage.transformToBlockData(),
            });

            this.entityManager.persist(page);
        }

        if (attachedPageTreeNodeId) {
            await this.pageTreeService.attachDocument({ id: pageId, type: "Page" }, attachedPageTreeNodeId);
        }

        await this.entityManager.flush();

        return page;
    }
}
