import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { DependentsResolverFactory } from "../dependencies/dependents.resolver.factory.js";
import { DocumentInterface } from "../document/dto/document-interface.js";
import { AttachedDocumentLoaderService } from "./attached-document-loader.service.js";
import { InternalLinkBlockTransformerService } from "./blocks/internal-link-block-transformer.service.js";
import { InternalLinkBlockWarningsService } from "./blocks/internal-link-block-warnings.service.js";
import { createPageTreeResolver } from "./createPageTreeResolver.js";
import { DocumentSubscriberFactory } from "./document-subscriber.js";
import { PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "./dto/page-tree-node.input.js";
import { AttachedDocument } from "./entities/attached-document.entity.js";
import { PageTreeNodeBase } from "./entities/page-tree-node-base.entity.js";
import { defaultReservedPaths, PAGE_TREE_CONFIG, PAGE_TREE_ENTITY, PAGE_TREE_REPOSITORY, SITE_PREVIEW_CONFIG } from "./page-tree.constants.js";
import { PageTreeService } from "./page-tree.service.js";
import { PageTreeNodeDocumentEntityInfoService } from "./page-tree-node-document-entity-info.service.js";
import { PageTreeNodeDocumentEntityScopeService } from "./page-tree-node-document-entity-scope.service.js";
import { PageTreeReadApiService } from "./page-tree-read-api.service.js";
import { SitePreviewResolver } from "./site-preview.resolver.js";
import type { PageTreeNodeInterface, ScopeInterface } from "./types.js";
import { PageExistsConstraint } from "./validators/page-exists.validator.js";

export interface PageTreeConfig {
    reservedPaths: string[];
}

interface PageTreeModuleOptions {
    PageTreeNode: Type<PageTreeNodeBase>;
    PageTreeNodeCreateInput?: Type<PageTreeNodeBaseCreateInput>;
    PageTreeNodeUpdateInput?: Type<PageTreeNodeBaseUpdateInput>;
    Documents: Type<DocumentInterface>[];
    Scope?: Type<ScopeInterface>;
    reservedPaths?: string[];
    sitePreviewSecret: string;
}

@Global()
@Module({})
export class PageTreeModule {
    static forRoot(options: PageTreeModuleOptions): DynamicModule {
        const { Documents, Scope, PageTreeNode, PageTreeNodeCreateInput, PageTreeNodeUpdateInput, reservedPaths } = options;

        if (PageTreeNode.name !== PAGE_TREE_ENTITY) {
            throw new Error(`PageTreeModule: Your PageTreeNode entity must be named ${PAGE_TREE_ENTITY}`);
        }

        const PageTreeResolver = createPageTreeResolver({
            PageTreeNode,
            Documents,
            Scope,
            PageTreeNodeCreateInput,
            PageTreeNodeUpdateInput,
        });
        const PageTreeDependentsResolver = DependentsResolverFactory.create(PageTreeNode);

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
                PageTreeResolver,
                PageTreeDependentsResolver,
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
                PageTreeNodeDocumentEntityInfoService,
                PageTreeNodeDocumentEntityScopeService,
                InternalLinkBlockTransformerService,
                InternalLinkBlockWarningsService,
                {
                    provide: SITE_PREVIEW_CONFIG,
                    useValue: {
                        secret: options.sitePreviewSecret,
                    },
                },
                SitePreviewResolver,
            ],
            exports: [
                PageTreeService,
                PageTreeReadApiService,
                AttachedDocumentLoaderService,
                PageTreeNodeDocumentEntityScopeService,
                InternalLinkBlockTransformerService,
            ],
        };
    }
}
