import cometConfig from "@src/comet-config.json";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";

import { EnvironmentVariables } from "./environment-variables";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createConfig(processEnv: NodeJS.ProcessEnv) {
    const envVars = plainToClass(EnvironmentVariables, { ...processEnv });
    const errors = validateSync(envVars, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    let contentGeneration = undefined;
    if (
        envVars.AZURE_OPEN_AI_CONTENT_GENERATION_API_KEY &&
        envVars.AZURE_OPEN_AI_CONTENT_GENERATION_API_URL &&
        envVars.AZURE_OPEN_AI_CONTENT_GENERATION_DEPLOYMENT_ID
    ) {
        contentGeneration = {
            apiKey: envVars.AZURE_OPEN_AI_CONTENT_GENERATION_API_KEY ?? "",
            apiUrl: envVars.AZURE_OPEN_AI_CONTENT_GENERATION_API_URL,
            deploymentId: envVars.AZURE_OPEN_AI_CONTENT_GENERATION_DEPLOYMENT_ID,
        };
    }

    return {
        ...cometConfig,
        debug: processEnv.NODE_ENV !== "production",
        helmRelease: envVars.HELM_RELEASE,
        apiUrl: envVars.API_URL,
        apiPort: envVars.API_PORT,
        adminUrl: envVars.ADMIN_URL,
        corsAllowedOrigins: envVars.CORS_ALLOWED_ORIGINS.split(","),
        auth: {
            systemUserPassword: envVars.BASIC_AUTH_SYSTEM_USER_PASSWORD,
        },
        imgproxy: {
            ...cometConfig.imgproxy,
            salt: envVars.IMGPROXY_SALT,
            url: envVars.IMGPROXY_URL,
            key: envVars.IMGPROXY_KEY,
        },
        contentGeneration,
        dam: {
            ...cometConfig.dam,
            secret: envVars.DAM_SECRET,
        },
        azureAiTranslator:
            envVars.AZURE_AI_TRANSLATOR_ENDPOINT && envVars.AZURE_AI_TRANSLATOR_KEY && envVars.AZURE_AI_TRANSLATOR_REGION
                ? {
                      endpoint: envVars.AZURE_AI_TRANSLATOR_ENDPOINT,
                      key: envVars.AZURE_AI_TRANSLATOR_KEY,
                      region: envVars.AZURE_AI_TRANSLATOR_REGION,
                  }
                : undefined,
        blob: {
            storage: {
                driver: envVars.BLOB_STORAGE_DRIVER,
                file: {
                    path: envVars.FILE_STORAGE_PATH,
                },
                azure: {
                    accountName: envVars.AZURE_ACCOUNT_NAME,
                    accountKey: envVars.AZURE_ACCOUNT_KEY,
                },
                s3: {
                    region: envVars.S3_REGION,
                    endpoint: envVars.S3_ENDPOINT,
                    bucket: envVars.S3_BUCKET,
                    accessKeyId: envVars.S3_ACCESS_KEY_ID,
                    secretAccessKey: envVars.S3_SECRET_ACCESS_KEY,
                },
            },
            storageDirectoryPrefix: envVars.BLOB_STORAGE_DIRECTORY_PREFIX,
        },
        cdn: {
            originCheckSecret: envVars.CDN_ORIGIN_CHECK_SECRET,
        },
        sentry:
            envVars.SENTRY_DSN && envVars.SENTRY_ENVIRONMENT
                ? {
                      dsn: envVars.SENTRY_DSN,
                      environment: envVars.SENTRY_ENVIRONMENT,
                  }
                : undefined,
        fileUploads: {
            ...cometConfig.fileUploads,
            download: {
                secret: envVars.FILE_UPLOADS_DOWNLOAD_SECRET,
            },
        },
        sitePreviewSecret: envVars.SITE_PREVIEW_SECRET,
        siteConfigs: envVars.PRIVATE_SITE_CONFIGS,
    };
}

export type Config = ReturnType<typeof createConfig>;
