import { PageTreeNodeVisibility, PageTreeService, PublicApi, RequestContext, RequestContextInterface } from "@comet/cms-api";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";

import { MainMenuObject } from "./dto/main-menu.object";
import { MainMenuItem } from "./entities/main-menu-item.entity";

@Resolver(() => MainMenuObject)
export class MenusResolver {
    constructor(
        private pageTreeService: PageTreeService,
        @InjectRepository(MainMenuItem) private readonly mainMenuItemRepository: EntityRepository<MainMenuItem>,
    ) {}

    @Query(() => MainMenuObject)
    @PublicApi()
    async mainMenu(
        @Args("scope", { type: () => PageTreeNodeScope }) scope: PageTreeNodeScope,
        @RequestContext() { includeInvisiblePages }: RequestContextInterface,
    ): Promise<MainMenuObject> {
        const rootNodes = await this.pageTreeService
            .createReadApi({
                visibility: [PageTreeNodeVisibility.Published, ...(includeInvisiblePages || [])],
            })
            .pageTreeRootNodeList({ scope, excludeHiddenInMenu: true, category: PageTreeNodeCategory.MainNavigation });

        const items = await Promise.all(
            rootNodes.map<Promise<MainMenuItem>>(async (node) => {
                const item = await this.mainMenuItemRepository.findOne({
                    node: node as unknown as PageTreeNode,
                });
                return (
                    item ??
                    this.mainMenuItemRepository.create({
                        node: node as PageTreeNode,
                        content: null,
                    })
                ); // @TODO: implement PageTreeService<PageTreeNode> to avoid "as"
            }),
        );

        return {
            items,
        };
    }
}
