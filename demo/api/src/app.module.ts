import {
    AuthModule,
    BlobStorageConfig,
    BlobStorageModule,
    BlocksModule,
    BlocksTransformerMiddlewareFactory,
    BlocksTransformerService,
    BuildsModule,
    DamModule,
    FilesService,
    ImagesService,
    PageTreeModule,
    PageTreeService,
    PublicUploadModule,
    RedirectsModule,
} from "@comet/cms-api";
import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@src/config/config.module";
import { configNS } from "@src/config/config.namespace";
import { DbModule } from "@src/db/db.module";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { PredefinedPage } from "@src/predefined-page/entities/predefined-page.entity";
import { Request } from "express";

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

@Module({
    imports: [
        ConfigModule,
        DbModule,
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule, BlocksModule],
            useFactory: async (config: ConfigType<typeof configNS>, blocksTransformerService: BlocksTransformerService) => ({
                debug: config.debug,
                playground: config.debug,
                autoSchemaFile: "schema.gql",
                context: ({ req }: { req: Request }) => ({ ...req }),
                cors: {
                    credentials: true,
                    origin: config.CORS_ALLOWED_ORIGINS.split(",").map((val: string) => new RegExp(val)),
                },
                buildSchemaOptions: {
                    fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(blocksTransformerService)],
                },
            }),
            inject: [configNS.KEY, BlocksTransformerService],
        }),
        AuthModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigType<typeof configNS>) => ({
                config: {
                    apiPassword: config.API_PASSWORD,
                    idpConfig: {
                        url: config.IDP_API_URL,
                        password: config.IDP_API_PASSWORD,
                        clientId: config.IDP_CLIENT_ID,
                    },
                },
            }),
            inject: [configNS.KEY],
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
        RedirectsModule.register({ customTargets: { news: NewsLinkBlock } }),
        BlobStorageModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigType<typeof configNS>) => ({
                blobStorageConfig: {
                    backend: {
                        driver: config.BLOB_STORAGE_DRIVER,
                        file:
                            config.BLOB_STORAGE_DRIVER === "file"
                                ? {
                                      path: config.FILE_STORAGE_PATH,
                                  }
                                : undefined,
                        azure:
                            config.BLOB_STORAGE_DRIVER === "azure"
                                ? {
                                      accountName: config.AZURE_ACCOUNT_NAME,
                                      accountKey: config.AZURE_ACCOUNT_KEY,
                                  }
                                : undefined,
                        s3:
                            config.BLOB_STORAGE_DRIVER === "s3"
                                ? {
                                      accessKeyId: config.S3_ACCESS_KEY_ID,
                                      secretAccessKey: config.S3_SECRET_ACCESS_KEY,
                                      endpoint: config.S3_ENDPOINT,
                                      region: config.S3_REGION,
                                      bucket: config.S3_BUCKET,
                                  }
                                : undefined,
                    } as BlobStorageConfig["backend"],
                },
            }),
            inject: [configNS.KEY],
        }),
        DamModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigType<typeof configNS>) => ({
                damConfig: {
                    filesBaseUrl: `${config.API_URL}/dam/files`,
                    imagesBaseUrl: `${config.API_URL}/dam/images`,
                    secret: config.DAM_SECRET,
                    additionalMimeTypes: [],
                    allowedImageSizes: config.DAM_ALLOWED_IMAGE_SIZES,
                    allowedAspectRatios: config.DAM_ALLOWED_IMAGE_ASPECT_RATIOS,
                    filesDirectory: `${config.BLOB_STORAGE_DIRECTORY_PREFIX}-files`,
                    cacheDirectory: `${config.BLOB_STORAGE_DIRECTORY_PREFIX}-cache`,
                    maxFileSize: config.DAM_UPLOADS_MAX_FILE_SIZE,
                },
                imgproxyConfig: {
                    url: config.IMGPROXY_URL,
                    salt: config.IMGPROXY_SALT,
                    key: config.IMGPROXY_KEY,
                    quality: config.IMGPROXY_QUALITY,
                    maxSrcResolution: config.IMGPROXY_MAX_SRC_RESOLUTION,
                },
            }),
            inject: [configNS.KEY],
        }),
        PublicUploadModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigType<typeof configNS>) => ({
                publicUploadConfig: {
                    maxFileSize: config.PUBLIC_UPLOADS_MAX_FILE_SIZE,
                    directory: `${config.BLOB_STORAGE_DIRECTORY_PREFIX}-public-uploads`,
                    acceptedMimeTypes: ["application/pdf", "application/x-zip-compressed", "application/zip"],
                },
            }),
            inject: [configNS.KEY],
        }),
        NewsModule,
        MenusModule,
        FooterModule,
        PredefinedPageModule,
        ProductsModule,
    ],
})
export class AppModule {}
