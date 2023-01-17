import {
    BlobStorageConfig,
    BlobStorageModule,
    BlocksModule,
    BlocksTransformerMiddlewareFactory,
    BlocksTransformerService,
    BuildsModule,
    ContentScope,
    ContentScopeModule,
    CurrentUserInterface,
    DamModule,
    FilesService,
    ImagesService,
    KubernetesModule,
    PageTreeModule,
    PageTreeService,
    PublicUploadModule,
    RedirectsModule,
} from "@comet/cms-api";
import { ApolloDriver } from "@nestjs/apollo";
import { DynamicModule, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { Config } from "@src/config/config";
import { ConfigModule } from "@src/config/config.module";
import { DbModule } from "@src/db/db.module";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { PredefinedPage } from "@src/predefined-page/entities/predefined-page.entity";
import { Request } from "express";

import { AuthModule } from "./auth/auth.module";
import { FooterModule } from "./footer/footer.module";
import { Link } from "./links/entities/link.entity";
import { MenusModule } from "./menus/menus.module";
import { NewsLinkBlock } from "./news/blocks/news-link.block";
import { NewsModule } from "./news/news.module";
import { PageTreeNodeCreateInput, PageTreeNodeUpdateInput } from "./page-tree/dto/page-tree-node.input";
import { PageTreeNodeScope } from "./page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "./page-tree/entities/page-tree-node.entity";
import { Page } from "./pages/entities/page.entity";
import { PredefinedPageModule } from "./predefined-page/predefined-page.module";
import { ProductsModule } from "./products/products.module";
import { RedirectScope } from "./redirects/dto/redirect-scope";

@Module({})
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule,
                DbModule,
                GraphQLModule.forRootAsync({
                    driver: ApolloDriver,
                    imports: [ConfigModule, BlocksModule],
                    useFactory: async (blocksTransformerService: BlocksTransformerService) => ({
                        debug: config.debug,
                        playground: config.debug,
                        autoSchemaFile: "schema.gql",
                        context: ({ req }: { req: Request }) => ({ ...req }),
                        cors: {
                            credentials: true,
                            origin: config.corsAllowedOrigins.map((val: string) => new RegExp(val)),
                        },
                        buildSchemaOptions: {
                            fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(blocksTransformerService)],
                        },
                    }),
                    inject: [BlocksTransformerService],
                }),
                AuthModule,
                ContentScopeModule.forRoot({
                    canAccessScope(requestScope: ContentScope, user: CurrentUserInterface) {
                        if (!user.domains) return true; //all domains
                        return user.domains.includes(requestScope.domain);
                    },
                }),
                BlocksModule.forRootAsync({
                    imports: [PagesModule],
                    useFactory: (pageTreeService: PageTreeService, filesService: FilesService, imagesService: ImagesService) => {
                        return {
                            transformerDependencies: {
                                pageTreeService,
                                filesService,
                                imagesService,
                            },
                        };
                    },
                    inject: [PageTreeService, FilesService, ImagesService],
                }),
                KubernetesModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async () => ({
                        config: {
                            helmRelease: config.helmRelease,
                        },
                    }),
                    inject: [],
                }),
                BuildsModule,
                LinksModule,
                PagesModule,
                PageTreeModule.forRoot({
                    PageTreeNode: PageTreeNode,
                    PageTreeNodeCreateInput: PageTreeNodeCreateInput,
                    PageTreeNodeUpdateInput: PageTreeNodeUpdateInput,
                    Documents: [Page, Link, PredefinedPage],
                    Scope: PageTreeNodeScope,
                    reservedPaths: ["/events"],
                }),
                RedirectsModule.register({ customTargets: { news: NewsLinkBlock }, Scope: RedirectScope }),
                BlobStorageModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async () => ({
                        blobStorageConfig: {
                            backend: {
                                driver: config.blob.storageDriver,
                                file:
                                    config.blob.storageDriver === "file"
                                        ? {
                                              path: config.fileStorage.path,
                                          }
                                        : undefined,
                                azure:
                                    config.blob.storageDriver === "azure"
                                        ? {
                                              accountName: config.azure.accountName,
                                              accountKey: config.azure.accountKey,
                                          }
                                        : undefined,
                                s3:
                                    config.blob.storageDriver === "s3"
                                        ? {
                                              accessKeyId: config.s3.accessKeyId,
                                              secretAccessKey: config.s3.secretAccessKey,
                                              endpoint: config.s3.endpoint,
                                              region: config.s3.region,
                                              bucket: config.s3.bucket,
                                          }
                                        : undefined,
                            } as BlobStorageConfig["backend"],
                        },
                    }),
                }),
                DamModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async () => ({
                        damConfig: {
                            filesBaseUrl: `${config.apiUrl}/dam/files`,
                            imagesBaseUrl: `${config.apiUrl}/dam/images`,
                            secret: config.dam.secret,
                            allowedImageSizes: config.dam.allowedImageSizes,
                            allowedAspectRatios: config.dam.allowedImageAspectRatios,
                            additionalMimeTypes: config.dam.additionalMimetypes,
                            filesDirectory: `${config.blob.storageDirectoryPrefix}-files`,
                            cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
                            maxFileSize: config.dam.uploadsMaxFileSize,
                        },
                        imgproxyConfig: {
                            url: config.imgproxy.url,
                            salt: config.imgproxy.salt,
                            key: config.imgproxy.key,
                            quality: config.imgproxy.quality,
                            maxSrcResolution: config.imgproxy.maxSrcResolution,
                        },
                    }),
                }),
                PublicUploadModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async () => ({
                        publicUploadConfig: {
                            maxFileSize: config.publicUploads.maxFileSize,
                            directory: `${config.blob.storageDirectoryPrefix}-public-uploads`,
                            acceptedMimeTypes: ["application/pdf", "application/x-zip-compressed", "application/zip"],
                        },
                    }),
                }),
                NewsModule,
                MenusModule,
                FooterModule,
                PredefinedPageModule,
                ProductsModule,
            ],
        };
    }
}
