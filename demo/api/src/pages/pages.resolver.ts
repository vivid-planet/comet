import {
    DependenciesResolver,
    DependenciesService,
    OffsetBasedPaginationArgs,
    PageTreeNodeInterface,
    PageTreeNodeVisibility,
    PageTreeService,
    SortArgs,
    SubjectEntity,
    validateNotModified,
} from "@comet/cms-api";
import { FindOptions } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ArgsType, ID, IntersectionType, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";

import { PageInput } from "./dto/page.input";
import { PaginatedPages } from "./dto/paginated-pages";
import { Page } from "./entities/page.entity";

@ArgsType()
export class PagesArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {}

@Resolver(() => Page)
export class PagesResolver extends DependenciesResolver(Page) {
    constructor(
        @InjectRepository(Page) private readonly repository: EntityRepository<Page>,
        private readonly pageTreeService: PageTreeService,
        private readonly dependenciesService: DependenciesService,
    ) {
        super(dependenciesService);
    }

    // TODO add scope argument (who uses this anyway? probably dashboard)
    @Query(() => PaginatedPages)
    async pages(@Args() { offset, limit, sortColumnName, sortDirection }: PagesArgs): Promise<PaginatedPages> {
        const options: FindOptions<Page> = { offset, limit };
        if (sortColumnName) {
            options.orderBy = { [sortColumnName]: sortDirection };
        }
        const [pages, totalCount] = await this.repository.findAndCount({}, options);

        return new PaginatedPages(pages, totalCount);
    }

    @ResolveField(() => PageTreeNode, { nullable: true })
    async pageTreeNode(@Parent() page: Page): Promise<PageTreeNodeInterface | null> {
        return this.pageTreeService.createReadApi().getFirstNodeByAttachedPageId(page.id);
    }

    @Mutation(() => Page)
    @SubjectEntity(Page, { pageTreeNodeIdArg: "attachedPageTreeNodeId" })
    async savePage(
        @Args("pageId", { type: () => ID }) pageId: string,
        @Args("input", { type: () => PageInput }) input: PageInput,
        @Args("attachedPageTreeNodeId", { type: () => ID }) attachedPageTreeNodeId: string,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<Page | null> {
        // all pageTypes need this is-archived-page-check
        // TODO: maybe implemented in a base-(document|page)-service which lives in @comet/cms-api
        const pageTreeNode = await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(attachedPageTreeNodeId);
        if (pageTreeNode.visibility === PageTreeNodeVisibility.Archived) {
            throw new UnauthorizedException("Archived pages cannot be updated");
        }

        let page = await this.repository.findOne(pageId);

        if (page) {
            if (lastUpdatedAt) {
                validateNotModified(page, lastUpdatedAt);
            }

            page.assign({
                content: input.content.transformToBlockData(),
                seo: input.seo.transformToBlockData(),
            });
        } else {
            page = this.repository.create({
                id: pageId,
                content: input.content.transformToBlockData(),
                seo: input.seo.transformToBlockData(),
            });

            this.repository.persist(page);
        }

        await this.pageTreeService.attachDocument({ id: pageId, type: "Page" }, attachedPageTreeNodeId);

        await this.repository.flush();

        return page;
    }
}
