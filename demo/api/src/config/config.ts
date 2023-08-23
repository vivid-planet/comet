import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";

import cometConfig from "../../comet-config.json";
import { EnvironmentVariables } from "./environment-variables";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createConfig(processEnv: NodeJS.ProcessEnv) {
    const envVars = plainToClass(EnvironmentVariables, { ...processEnv });
    const errors = validateSync(envVars, { skipMissingProperties: false });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return {
        ...cometConfig,
        debug: processEnv.NODE_ENV !== "production",
        helmRelease: envVars.HELM_RELEASE,
        apiUrl: envVars.API_URL,
        apiPort: envVars.API_PORT,
        corsAllowedOrigins: envVars.CORS_ALLOWED_ORIGINS.split(","),
        hmacSecret: envVars.HMAC_SECRET,
        imgproxy: {
            ...cometConfig.imgproxy,
            salt: envVars.IMGPROXY_SALT,
            url: envVars.IMGPROXY_URL,
            key: envVars.IMGPROXY_KEY,
        },
        dam: {
            ...cometConfig.dam,
            secret: envVars.DAM_SECRET,
        },
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
    };
}

export type Config = ReturnType<typeof createConfig>;
