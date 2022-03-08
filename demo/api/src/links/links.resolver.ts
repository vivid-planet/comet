import { PageTreeNodeVisibility, PageTreeService, validateNotModified } from "@comet/api-cms";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UnauthorizedException } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LinkInput } from "@src/links/dto/link.input";

import { Link } from "./entities/link.entity";

@Resolver(() => Link)
export class LinksResolver {
    constructor(@InjectRepository(Link) private readonly repository: EntityRepository<Link>, protected readonly pageTreeService: PageTreeService) {}

    @Query(() => Link, { nullable: true })
    async link(@Args("linkId", { type: () => ID }) linkId: string): Promise<Link | null> {
        return this.repository.findOne(linkId);
    }

    @Mutation(() => Link)
    async saveLink(
        @Args("linkId", { type: () => ID }) linkId: string,
        @Args("input", { type: () => LinkInput }) input: LinkInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
        @Args("attachedPageTreeNodeId", { nullable: true, type: () => ID }) attachedPageTreeNodeId?: string,
    ): Promise<Link | null> {
        // all pageTypes need this is-archived-page-check
        // TODO: maybe implemented in a base-(document|page)-service which lives in @comet/api-cms
        if (attachedPageTreeNodeId) {
            const pageTreeNode = await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(attachedPageTreeNodeId);
            if (pageTreeNode.visibility === PageTreeNodeVisibility.Archived) {
                throw new UnauthorizedException("Archived Links cannot be updated");
            }
        }
        const existingLink = await this.repository.findOne(linkId);

        if (existingLink) {
            if (lastUpdatedAt) {
                validateNotModified(existingLink, lastUpdatedAt);
            }

            existingLink.assign({ content: input.content.transformToBlockData() });
            await this.repository.persistAndFlush(existingLink);
        } else {
            await this.repository.persistAndFlush(
                this.repository.create({
                    id: linkId,
                    content: input.content.transformToBlockData(),
                }),
            );
        }

        if (attachedPageTreeNodeId) {
            await this.pageTreeService.attachDocument({ id: linkId, type: "Link" }, attachedPageTreeNodeId);
        }

        return this.repository.findOneOrFail(linkId);
    }
}
