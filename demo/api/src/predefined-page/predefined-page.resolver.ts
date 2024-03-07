import {
    AffectedEntity,
    PageTreeNodeInterface,
    PageTreeNodeVisibility,
    PageTreeService,
    RequestContext,
    RequestContextInterface,
    RequiredPermission,
    validateNotModified,
} from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";

import { PredefinedPageInput } from "./dto/predefined-page.input";
import { PredefinedPage } from "./entities/predefined-page.entity";
import { PredefinedPageService } from "./predefined-page.service";

@Resolver(() => PredefinedPage)
@RequiredPermission("pageTree")
export class PredefinedPageResolver {
    constructor(
        @InjectRepository(PredefinedPage) private readonly repository: EntityRepository<PredefinedPage>,
        private readonly pageTreeService: PageTreeService,
        private readonly predefinedPageService: PredefinedPageService,
    ) {}

    @Query(() => PredefinedPage, { nullable: true })
    @AffectedEntity(PredefinedPage)
    async predefinedPage(@Args("id", { type: () => ID }) id: string): Promise<PredefinedPage | null> {
        return this.repository.findOneOrFail(id);
    }

    @Mutation(() => PredefinedPage)
    @AffectedEntity(PredefinedPage, { pageTreeNodeIdArg: "attachedPageTreeNodeId" })
    async savePredefinedPage(
        @Args("id", { type: () => ID }) id: string,
        @Args("input", { type: () => PredefinedPageInput }) input: PredefinedPageInput,
        @Args("attachedPageTreeNodeId", { type: () => ID }) attachedPageTreeNodeId: string,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<PredefinedPage | null> {
        // all pageTypes need this is-archived-page-check
        // TODO: maybe implemented in a base-(document|page)-service which lives in @comet/cms-api
        const pageTreeNode = await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(attachedPageTreeNodeId);
        if (pageTreeNode.visibility === PageTreeNodeVisibility.Archived) {
            throw new UnauthorizedException("Archived Structured Content cannot be updated");
        }

        let predefinedPage = await this.repository.findOne(id);

        if (predefinedPage) {
            if (lastUpdatedAt) {
                validateNotModified(predefinedPage, lastUpdatedAt);
            }

            predefinedPage.assign({
                type: input.type,
            });
        } else {
            predefinedPage = this.repository.create({
                id,
                type: input.type,
            });

            this.repository.persist(predefinedPage);
        }

        await this.pageTreeService.attachDocument({ id, type: "PredefinedPage" }, attachedPageTreeNodeId);

        await this.repository.flush();

        return this.repository.findOneOrFail(id);
    }

    @Query(() => PageTreeNode, { nullable: true })
    async pageTreeNodeForPredefinedPage(
        @Args("type") type: string,
        @Args("scope", { type: () => PageTreeNodeScope }) scope: PageTreeNodeScope,
        @RequestContext() { includeInvisiblePages }: RequestContextInterface,
    ): Promise<PageTreeNodeInterface | null> {
        return this.predefinedPageService.pageTreeNodeForPredefinedPage(type, scope, includeInvisiblePages);
    }
}
