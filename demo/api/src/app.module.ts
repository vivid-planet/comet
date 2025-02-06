import {
    AccessLogModule,
    AzureAiTranslatorModule,
    AzureOpenAiContentGenerationModule,
    BlobStorageModule,
    BlocksModule,
    BlocksTransformerMiddlewareFactory,
    BuildsModule,
    ContentGenerationModule,
    CronJobsModule,
    DamModule,
    DependenciesModule,
    FileUploadsModule,
    KubernetesModule,
    PageTreeModule,
    RedirectsModule,
    SentryModule,
    UserPermissionsModule,
} from "@comet/cms-api";
import { ApolloDriver, ApolloDriverConfig, ValidationError } from "@nestjs/apollo";
import { DynamicModule, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Enhancer, GraphQLModule } from "@nestjs/graphql";
import { Config } from "@src/config/config";
import { ConfigModule } from "@src/config/config.module";
import { ContentGenerationService } from "@src/content-generation/content-generation.service";
import { DbModule } from "@src/db/db.module";
import { LinksModule } from "@src/documents/links/links.module";
import { PagesModule } from "@src/documents/pages/pages.module";
import { Request } from "express";

import { AccessControlService } from "./auth/access-control.service";
import { AuthModule, SYSTEM_USER_NAME } from "./auth/auth.module";
import { UserService } from "./auth/user.service";
import { DamScope } from "./dam/dto/dam-scope";
import { DamFile } from "./dam/entities/dam-file.entity";
import { DamFolder } from "./dam/entities/dam-folder.entity";
import { Link } from "./documents/links/entities/link.entity";
import { Page } from "./documents/pages/entities/page.entity";
import { PredefinedPage } from "./documents/predefined-pages/entities/predefined-page.entity";
import { PredefinedPagesModule } from "./documents/predefined-pages/predefined-pages.module";
import { FooterModule } from "./footer/footer.module";
import { MenusModule } from "./menus/menus.module";
import { NewsLinkBlock } from "./news/blocks/news-link.block";
import { NewsModule } from "./news/news.module";
import { OpenTelemetryModule } from "./open-telemetry/open-telemetry.module";
import { PageTreeNodeCreateInput, PageTreeNodeUpdateInput } from "./page-tree/dto/page-tree-node.input";
import { PageTreeNodeScope } from "./page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "./page-tree/entities/page-tree-node.entity";
import { ProductsModule } from "./products/products.module";
import { RedirectScope } from "./redirects/dto/redirect-scope";

@Module({})
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        const authModule = AuthModule.forRoot(config);

        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot(config),
                DbModule,
                GraphQLModule.forRootAsync<ApolloDriverConfig>({
                    driver: ApolloDriver,
                    imports: [BlocksModule],
                    useFactory: (moduleRef: ModuleRef) => ({
                        debug: config.debug,
                        playground: config.debug,
                        autoSchemaFile: "schema.gql",
                        formatError: (error) => {
                            // Disable GraphQL field suggestions in production
                            if (process.env.NODE_ENV !== "development") {
                                if (error.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
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
                            fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(moduleRef)],
                        },
                        // See https://docs.nestjs.com/graphql/other-features#execute-enhancers-at-the-field-resolver-level
                        fieldResolverEnhancers: ["guards", "interceptors", "filters"] as Enhancer[],
                    }),
                    inject: [ModuleRef],
                }),
                authModule,
                UserPermissionsModule.forRootAsync({
                    useFactory: (userService: UserService, accessControlService: AccessControlService) => ({
                        availableContentScopes: config.siteConfigs.flatMap((siteConfig) =>
                            siteConfig.scope.languages.map((language) => ({
                                domain: siteConfig.scope.domain,
                                language,
                            })),
                        ),
                        userService,
                        accessControlService,
                        systemUsers: [SYSTEM_USER_NAME],
                    }),
                    inject: [UserService, AccessControlService],
                    imports: [authModule],
                }),
                BlocksModule,
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
                    sitePreviewSecret: config.sitePreviewSecret,
                }),

                RedirectsModule.register({ customTargets: { news: NewsLinkBlock }, Scope: RedirectScope }),
                BlobStorageModule.register({
                    backend: config.blob.storage,
                }),
                DamModule.register({
                    damConfig: {
                        apiUrl: config.apiUrl,
                        secret: config.dam.secret,
                        allowedImageSizes: config.dam.allowedImageSizes,
                        allowedAspectRatios: config.dam.allowedImageAspectRatios,
                        filesDirectory: `${config.blob.storageDirectoryPrefix}-files`,
                        cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
                        maxFileSize: config.dam.uploadsMaxFileSize,
                    },
                    imgproxyConfig: config.imgproxy,
                    Scope: DamScope,
                    File: DamFile,
                    Folder: DamFolder,
                }),
                FileUploadsModule.register({
                    maxFileSize: config.fileUploads.maxFileSize,
                    directory: `${config.blob.storageDirectoryPrefix}-file-uploads`,
                    acceptedMimeTypes: [
                        "application/pdf",
                        "application/x-zip-compressed",
                        "application/zip",
                        "image/png",
                        "image/jpeg",
                        "image/gif",
                        "image/webp",
                    ],
                    upload: {
                        public: true,
                    },
                    download: { public: true, ...config.fileUploads.download },
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
                PredefinedPagesModule,
                CronJobsModule,
                ProductsModule,
                ...(config.azureAiTranslator ? [AzureAiTranslatorModule.register(config.azureAiTranslator)] : []),
                AccessLogModule.forRoot({
                    shouldLogRequest: ({ user }) => {
                        // Ignore system user
                        if (user === "system-user") {
                            return false;
                        }
                        return true;
                    },
                }),
                OpenTelemetryModule,
                ...(config.sentry ? [SentryModule.forRootAsync(config.sentry)] : []),
            ],
        };
    }
}
