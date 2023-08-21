import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { FileInterface } from "../dam/files/entities/file.entity";
import { DocumentInterface } from "../document/dto/document-interface";
import { AttachedDocumentLoaderService } from "./attached-document-loader.service";
import { createPageTreeResolver } from "./createPageTreeResolver";
import { DocumentSubscriberFactory } from "./document-subscriber";
import { PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "./dto/page-tree-node.input";
import { AttachedDocument } from "./entities/attached-document.entity";
import { PageTreeNodeBase } from "./entities/page-tree-node-base.entity";
import { defaultReservedPaths, PAGE_TREE_CONFIG, PAGE_TREE_ENTITY, PAGE_TREE_REPOSITORY } from "./page-tree.constants";
import { PageTreeService } from "./page-tree.service";
import { PageTreeReadApiService } from "./page-tree-read-api.service";
import type { PageTreeNodeInterface, ScopeInterface } from "./types";
import { PageExistsConstraint } from "./validators/page-exists.validator";

export interface PageTreeConfig {
    reservedPaths: string[];
}

interface PageTreeModuleOptions {
    PageTreeNode: Type<PageTreeNodeBase>;
    PageTreeNodeCreateInput?: Type<PageTreeNodeBaseCreateInput>;
    PageTreeNodeUpdateInput?: Type<PageTreeNodeBaseUpdateInput>;
    Documents: Type<DocumentInterface>[];
    Scope?: Type<ScopeInterface>;
    File: Type<FileInterface>;
    reservedPaths?: string[];
}

@Global()
@Module({})
export class PageTreeModule {
    static forRoot(options: PageTreeModuleOptions): DynamicModule {
        const { Documents, Scope, PageTreeNode, File, PageTreeNodeCreateInput, PageTreeNodeUpdateInput, reservedPaths } = options;

        if (PageTreeNode.name !== PAGE_TREE_ENTITY) {
            throw new Error(`PageTreeModule: Your PageTreeNode entity must be named ${PAGE_TREE_ENTITY}`);
        }

        const pageTreeResolver = createPageTreeResolver({
            PageTreeNode,
            Documents,
            Scope,
            PageTreeNodeCreateInput,
            PageTreeNodeUpdateInput,
            File,
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

        const documentSubscriber = DocumentSubscriberFactory.create({ Documents });

        return {
            module: PageTreeModule,
            imports: [MikroOrmModule.forFeature([AttachedDocument, PageTreeNode, ...(Scope ? [Scope] : [])])],
            providers: [
                PageTreeService,
                PageTreeReadApiService,
                AttachedDocumentLoaderService,
                pageTreeResolver,
                repositoryProvider,
                pageTreeConfigProvider,
                {
                    provide: PageExistsConstraint,
                    useFactory: (pageTreeService: PageTreeService) => {
                        return new PageExistsConstraint(pageTreeService);
                    },
                    inject: [PageTreeService],
                },
                documentSubscriber,
            ],
            exports: [PageTreeService, PageTreeReadApiService, AttachedDocumentLoaderService],
        };
    }
}
