import { MikroOrmModule } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { DependenciesResolverFactory } from "../dependencies/dependencies.resolver.factory";
import { DependentsResolverFactory } from "../dependencies/dependents.resolver.factory";
import { DocumentInterface } from "../document/dto/document-interface";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { AttachedDocumentLoaderService } from "./attached-document-loader.service";
import { InternalLinkBlockTransformerService } from "./blocks/internal-link-block-transformer.service";
import { InternalLinkBlockWarningsService } from "./blocks/internal-link-block-warnings.service";
import { createPageTreeResolver } from "./createPageTreeResolver";
import { DocumentSubscriberFactory } from "./document-subscriber";
import { PageTreeNodeBaseCreateInput, PageTreeNodeBaseUpdateInput } from "./dto/page-tree-node.input";
import { AttachedDocument } from "./entities/attached-document.entity";
import { PageTreeNodeBase } from "./entities/page-tree-node-base.entity";
import { defaultReservedPaths, PAGE_TREE_CONFIG, PAGE_TREE_ENTITY, PAGE_TREE_REPOSITORY, SITE_PREVIEW_CONFIG } from "./page-tree.constants";
import { PageTreeService } from "./page-tree.service";
import { PageTreeNodeDocumentEntityInfoService } from "./page-tree-node-document-entity-info.service";
import { PageTreeNodeDocumentEntityScopeService } from "./page-tree-node-document-entity-scope.service";
import { PageTreeReadApiService } from "./page-tree-read-api.service";
import { SitePreviewResolver } from "./site-preview.resolver";
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
    reservedPaths?: string[];
    sitePreviewSecret: string | ((scope: ContentScope) => string);
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
        const PageTreeDependenciesResolver = DependenciesResolverFactory.create(PageTreeNode);

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
                PageTreeDependenciesResolver,
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
