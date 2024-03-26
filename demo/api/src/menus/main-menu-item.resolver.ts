import {
    AffectedEntity,
    PageTreeNodeVisibility,
    PageTreeService,
    RequestContext,
    RequestContextInterface,
    RequiredPermission,
    validateNotModified,
} from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";

import { MainMenuItemInput } from "./dto/main-menu-item.input";
import { MainMenuItem } from "./entities/main-menu-item.entity";

@Resolver(() => MainMenuItem)
@RequiredPermission(["pageTree"])
export class MainMenuItemResolver {
    constructor(
        @InjectRepository(MainMenuItem) private readonly mainMenuItemRepository: EntityRepository<MainMenuItem>,
        private readonly pageTreeService: PageTreeService,
    ) {}

    @Query(() => MainMenuItem)
    @AffectedEntity(MainMenuItem, { pageTreeNodeIdArg: "pageTreeNodeId" })
    async mainMenuItem(
        @Args("pageTreeNodeId", { type: () => ID }) pageTreeNodeId: string,
        @RequestContext() { includeInvisiblePages }: RequestContextInterface,
    ): Promise<MainMenuItem> {
        const node = await this.pageTreeService
            .createReadApi({
                visibility: [PageTreeNodeVisibility.Published, ...(includeInvisiblePages || [])],
            })
            .getNodeOrFail(pageTreeNodeId);

        const item = await this.mainMenuItemRepository.findOne({ node });

        return (
            item ??
            this.mainMenuItemRepository.create({
                node: node as unknown as PageTreeNode,
                content: null,
            })
        ); // @TODO: implement PageTreeService<PageTreeNode> to avoid "as"
    }

    @Mutation(() => MainMenuItem)
    @AffectedEntity(MainMenuItem, { pageTreeNodeIdArg: "pageTreeNodeId" })
    async updateMainMenuItem(
        @Args("pageTreeNodeId", { type: () => ID }) pageTreeNodeId: string,
        @Args("input", { type: () => MainMenuItemInput }) input: MainMenuItemInput,
        @Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,
    ): Promise<MainMenuItem> {
        const node = await this.pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(pageTreeNodeId);

        const existingItem = await this.mainMenuItemRepository.findOne({ node });

        if (existingItem) {
            if (lastUpdatedAt) {
                validateNotModified(existingItem, lastUpdatedAt);
            }

            existingItem.assign({ content: input.content ? input.content.transformToBlockData() : null });
            await this.mainMenuItemRepository.persistAndFlush(existingItem);
        } else {
            await this.mainMenuItemRepository.persistAndFlush(
                this.mainMenuItemRepository.create({
                    node: node as unknown as PageTreeNode,
                    content: input.content ? input.content.transformToBlockData() : null,
                }),
            );
        }

        return this.mainMenuItemRepository.findOneOrFail({ node });
    }
}
