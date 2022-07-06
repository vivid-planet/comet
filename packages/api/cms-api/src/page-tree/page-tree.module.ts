import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { DocumentInterface } from "../document/dto/document-interface";
import { createPageTreeResolver } from "./createPageTreeResolver";
import { PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "./dto/page-tree-node.input";
import { AttachedDocument } from "./entities/attached-document.entity";
import { PageTreeNodeBase } from "./entities/page-tree-node-base.entity";
import { defaultReservedPaths, PAGE_TREE_CONFIG, PAGE_TREE_REPOSITORY } from "./page-tree.constants";
import { PageTreeService } from "./page-tree.service";
import type { PageTreeNodeInterface, ScopeInterface } from "./types";

export interface PageTreeConfig {
    reservedPaths: string[];
}

interface PageTreeModuleOptions {
    PageTreeNode: Type<PageTreeNodeBase>;
    PageTreeNodeCreateInput?: Type<PageTreeNodeBaseCreateInput>;
    PageTreeNodeUpdateInput?: Type<PageTreeNodeBaseUpdateInput>;
    Documents: Type<DocumentInterface>[];
    Scope?: Type<ScopeInterface>;
    Category?: unknown;
    reservedPaths?: string[];
}

@Global()
@Module({})
export class PageTreeModule {
    static forRoot(options: PageTreeModuleOptions): DynamicModule {
        const { Documents, Scope, PageTreeNode, PageTreeNodeCreateInput, PageTreeNodeUpdateInput, Category, reservedPaths } = options;
        const pageTreeResolver = createPageTreeResolver({
            PageTreeNode,
            Documents,
            Scope: Scope,
            Category,
            PageTreeNodeCreateInput,
            PageTreeNodeUpdateInput,
        });

        const repositoryProvider = {
            provide: PAGE_TREE_REPOSITORY,
            useFactory: async (em: EntityManager): Promise<EntityRepository<PageTreeNodeInterface>> => {
                return em.getRepository(PageTreeNode);
            },
            inject: [EntityManager],
        };

        const pageTreeConfigProvider: ValueProvider<PageTreeConfig> = {
            provide: PAGE_TREE_CONFIG,
            useValue: {
                reservedPaths: [...defaultReservedPaths, ...(reservedPaths ?? [])],
            },
        };

        return {
            module: PageTreeModule,
            imports: [MikroOrmModule.forFeature([AttachedDocument, PageTreeNode, ...(Scope ? [Scope] : [])])],
            providers: [PageTreeService, pageTreeResolver, repositoryProvider, pageTreeConfigProvider],
            exports: [PageTreeService],
        };
    }
}
