import {
    AccessLogModule,
    AzureOpenAiContentGenerationModule,
    BlobStorageModule,
    BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES,
    BlocksModule,
    BlocksTransformerMiddlewareFactory,
    BuildsModule,
    ContentGenerationModule,
    CronJobsModule,
    DamModule,
    DependenciesModule,
    FilesService,
    ImagesService,
    KubernetesModule,
    PageTreeModule,
    PageTreeService,
    PublicUploadModule,
    RedirectsModule,
    UserPermissionsModule,
} from "@comet/cms-api";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { DynamicModule, Module } from "@nestjs/common";
import { Enhancer, GraphQLModule } from "@nestjs/graphql";
import { Config } from "@src/config/config";
import { ConfigModule } from "@src/config/config.module";
import { ContentGenerationService } from "@src/content-generation/content-generation.service";
import { DbModule } from "@src/db/db.module";
import { LinksModule } from "@src/links/links.module";
import { PagesModule } from "@src/pages/pages.module";
import { PredefinedPage } from "@src/predefined-page/entities/predefined-page.entity";
import { ValidationError } from "apollo-server-express";
import { Request } from "express";

import { AccessControlService } from "./auth/access-control.service";
import { AuthModule } from "./auth/auth.module";
import { UserService } from "./auth/user.service";
import { DamScope } from "./dam/dto/dam-scope";
import { DamFile } from "./dam/entities/dam-file.entity";
import { DamFolder } from "./dam/entities/dam-folder.entity";
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
                ConfigModule.forRoot(config),
                DbModule,
                GraphQLModule.forRootAsync<ApolloDriverConfig>({
                    driver: ApolloDriver,
                    imports: [BlocksModule],
                    useFactory: (dependencies: Record<string, unknown>) => ({
                        debug: config.debug,
                        playground: config.debug,
                        autoSchemaFile: "schema.gql",
                        formatError: (error) => {
                            // Disable GraphQL field suggestions in production
                            if (process.env.NODE_ENV !== "development") {
                                if (error instanceof ValidationError) {
                                    return new ValidationError("Invalid request.");
                                }
                            }
                            return error;
                        },
                        context: ({ req }: { req: Request }) => ({ ...req }),
                        cors: {
                            credentials: true,
                            origin: config.corsAllowedOrigins.map((val: string) => new RegExp(val)),
                        },
                        buildSchemaOptions: {
                            fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(dependencies)],
                        },
                        // See https://docs.nestjs.com/graphql/other-features#execute-enhancers-at-the-field-resolver-level
                        fieldResolverEnhancers: ["guards", "interceptors", "filters"] as Enhancer[],
                    }),
                    inject: [BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES],
                }),
                AuthModule,
                UserPermissionsModule.forRootAsync({
                    useFactory: (userService: UserService, accessControlService: AccessControlService) => ({
                        availableContentScopes: [
                            { domain: "main", language: "de" },
                            { domain: "main", language: "en" },
                            { domain: "secondary", language: "en" },
                        ],
                        userService,
                        accessControlService,
                    }),
                    inject: [UserService, AccessControlService],
                    imports: [AuthModule],
                }),
                BlocksModule.forRoot({
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
                DependenciesModule,
                KubernetesModule.register({
                    helmRelease: config.helmRelease,
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
                BlobStorageModule.register({
                    backend: config.blob.storage,
                }),
                DamModule.register({
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
                    imgproxyConfig: config.imgproxy,
                    Scope: DamScope,
                    File: DamFile,
                    Folder: DamFolder,
                }),
                PublicUploadModule.register({
                    maxFileSize: config.publicUploads.maxFileSize,
                    directory: `${config.blob.storageDirectoryPrefix}-public-uploads`,
                    acceptedMimeTypes: ["application/pdf", "application/x-zip-compressed", "application/zip"],
                }),
                ...(config.contentGeneration
                    ? [
                          ContentGenerationModule.register({
                              Service: ContentGenerationService,
                              imports: [AzureOpenAiContentGenerationModule.register(config.contentGeneration)],
                          }),
                      ]
                    : []),
                NewsModule,
                MenusModule,
                FooterModule,
                PredefinedPageModule,
                CronJobsModule,
                ProductsModule,
                AccessLogModule.forRoot({
                    shouldLogRequest: ({ user }) => {
                        // Ignore system user
                        if (user === true) {
                            return false;
                        }
                        return true;
                    },
                }),
            ],
        };
    }
}
