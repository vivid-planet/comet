import { TransformDependencies } from "@comet/api-blocks";
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
} from "@comet/api-cms";
import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@src/config/config.module";
import { configNS } from "@src/config/config.namespace";
import { DbModule } from "@src/db/db.module";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";

import { Link } from "./links/entities/link.entity";
import { MenusModule } from "./menus/menus.module";
import { NewsModule } from "./news/news.module";
import { PageTreeNodeScope } from "./page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "./page-tree/entities/page-tree-node.entity";
import { PageTreeNodeCategory } from "./page-tree/page-tree-node-category";
import { Page } from "./pages/entities/page.entity";

@Module({
    imports: [
        ConfigModule,
        DbModule,
        GraphQLModule.forRootAsync({
            imports: [ConfigModule, BlocksModule],
            useFactory: async (config: ConfigType<typeof configNS>, blocksTransformerService: BlocksTransformerService) => ({
                debug: config.debug,
                playground: config.debug,
                autoSchemaFile: "schema.gql",
                context: ({ req }) => ({ ...req }),
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
                const blocksApiTransformDependencies: TransformDependencies = {
                    pageTreeApi: {
                        getNode: (id) => pageTreeService.createReadApi({ visibility: "all" }).getNode(id), // @TODO: inject pageTreeApi using a function so createReadApi can be called safely
                        getNodePath: (node) => pageTreeService.createReadApi({ visibility: "all" }).nodePath(node),
                    },
                };

                return {
                    transformerDependencies: {
                        ...blocksApiTransformDependencies,
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
            Documents: [Page, Link],
            Scope: PageTreeNodeScope,
            Category: PageTreeNodeCategory,
            reservedPaths: ["/events"],
        }),
        RedirectsModule.register({ PageTreeNode: PageTreeNode }),
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
                    allowedImageSizes: config.DAM_ALLOWED_IMAGE_SIZES,
                    allowedAspectRatios: config.DAM_ALLOWED_IMAGE_ASPECT_RATIOS,
                    additionalMimetypes: config.DAM_ADDITIONAL_MIMETYPES,
                    filesDirectory: `${config.BLOB_STORAGE_DIRECTORY_PREFIX}-files`,
                    cacheDirectory: `${config.BLOB_STORAGE_DIRECTORY_PREFIX}-cache`,
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
                },
            }),
            inject: [configNS.KEY],
        }),
        NewsModule,
        MenusModule,
    ],
})
export class AppModule {}
