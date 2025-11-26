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
    ImgproxyModule,
    KubernetesModule,
    MailerModule,
    MailTemplatesModule,
    SentryModule,
    UserPermissionsModule,
    WarningsModule,
} from "@comet/cms-api";
import { ApolloDriver, ApolloDriverConfig, ValidationError } from "@nestjs/apollo";
import { DynamicModule, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Enhancer, GraphQLModule } from "@nestjs/graphql";
import { AppPermission } from "@src/auth/app-permission.enum";
import { Config } from "@src/config/config";
import { ConfigModule } from "@src/config/config.module";
import { ContentGenerationService } from "@src/content-generation/content-generation.service";
import { DbModule } from "@src/db/db.module";
import { TranslationModule } from "@src/translation/translation.module";
import { Request } from "express";

import { AccessControlService } from "./auth/access-control.service";
import { AuthModule, SYSTEM_USER_NAME } from "./auth/auth.module";
import { UserService } from "./auth/user.service";
import { DamScope } from "./dam/dto/dam-scope";
import { DamFile } from "./dam/entities/dam-file.entity";
import { DamFolder } from "./dam/entities/dam-folder.entity";
import { OpenTelemetryModule } from "./open-telemetry/open-telemetry.module";
import { ProductsModule } from "./products/products.module";
import { StatusModule } from "./status/status.module";

@Module({})
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        const authModule = AuthModule.forRoot(config);

        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot(config),
                TranslationModule,
                DbModule,
                GraphQLModule.forRootAsync<ApolloDriverConfig>({
                    driver: ApolloDriver,
                    imports: [BlocksModule],
                    useFactory: (moduleRef: ModuleRef) => ({
                        debug: config.debug,
                        graphiql: config.debug ? { url: "/api/graphql" } : undefined,
                        playground: false,
                        autoSchemaFile: "schema.gql",
                        sortSchema: true,
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
                        useGlobalPrefix: true,
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
                        // TODO: Replace with dynamic content scopes
                        availableContentScopes: [
                            {
                                scope: { domain: "main", language: "en" },
                                label: { domain: "Main" },
                            },
                        ],
                        userService,
                        accessControlService,
                        systemUsers: [SYSTEM_USER_NAME],
                    }),
                    inject: [UserService, AccessControlService],
                    imports: [authModule],
                    AppPermission,
                }),
                BlocksModule,
                DependenciesModule,
                KubernetesModule.register({
                    helmRelease: config.helmRelease,
                }),
                BuildsModule,
                BlobStorageModule.register({
                    backend: config.blob.storage,
                    cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
                }),
                ImgproxyModule.register(config.imgproxy),
                DamModule.register({
                    damConfig: {
                        secret: config.dam.secret,
                        allowedImageSizes: config.dam.allowedImageSizes,
                        allowedAspectRatios: config.dam.allowedImageAspectRatios,
                        filesDirectory: `${config.blob.storageDirectoryPrefix}-files`,
                        maxFileSize: config.dam.uploadsMaxFileSize,
                        maxSrcResolution: config.dam.maxSrcResolution,
                    },
                    Scope: DamScope,
                    File: DamFile,
                    Folder: DamFolder,
                }),
                StatusModule,
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
                CronJobsModule,
                MailerModule.register(config.mailer),
                MailTemplatesModule,
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
                WarningsModule,
            ],
        };
    }
}
