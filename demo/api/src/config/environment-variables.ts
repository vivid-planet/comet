import { BlobStorageConfig, IsUndefinable } from "@comet/cms-api";
import { PrivateSiteConfig } from "@src/site-configs";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsInt, IsOptional, IsString, IsUrl, MinLength, ValidateIf } from "class-validator";

export class EnvironmentVariables {
    @IsString()
    @ValidateIf(() => process.env.NODE_ENV === "production")
    HELM_RELEASE: string;

    @IsString()
    POSTGRESQL_HOST: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true")
    POSTGRESQL_USE_SSL: boolean;

    @Type(() => Number)
    @IsInt()
    POSTGRESQL_PORT: number;

    @IsString()
    POSTGRESQL_DB: string;

    @IsOptional()
    @IsString()
    POSTGRESQL_USER?: string;

    @IsString()
    POSTGRESQL_PWD: string;

    @IsString()
    API_URL: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === "true")
    USE_AUTHPROXY: boolean;

    @IsString()
    @ValidateIf((v) => v.USE_AUTHPROXY === "true")
    IDP_CLIENT_ID: string;

    @IsString()
    @ValidateIf((v) => v.USE_AUTHPROXY === "true")
    IDP_JWKS_URI: string;

    @IsString()
    @ValidateIf((v) => v.USE_AUTHPROXY === "true")
    IDP_END_SESSION_ENDPOINT: string;

    @IsString()
    @ValidateIf((v) => v.USE_AUTHPROXY === "true")
    POST_LOGOUT_REDIRECT_URI: string;

    @IsString()
    @MinLength(16)
    BASIC_AUTH_SYSTEM_USER_PASSWORD: string;

    @IsString()
    ADMIN_URL: string;

    @Type(() => Number)
    @IsInt()
    API_PORT: number;

    @IsString()
    CORS_ALLOWED_ORIGINS: string;

    @IsString()
    IMGPROXY_SALT: string;

    @IsString()
    IMGPROXY_URL: string;

    @IsString()
    IMGPROXY_KEY: string;

    @IsInt()
    IMGPROXY_QUALITY = 80;

    @IsString()
    @MinLength(16)
    DAM_SECRET: string;

    @IsString()
    BLOB_STORAGE_DRIVER: BlobStorageConfig["backend"]["driver"];

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "file")
    @IsString()
    FILE_STORAGE_PATH: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "azure")
    @IsString()
    AZURE_ACCOUNT_NAME: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "azure")
    @IsString()
    AZURE_ACCOUNT_KEY: string;

    @IsString()
    BLOB_STORAGE_DIRECTORY_PREFIX: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "s3")
    @IsString()
    S3_REGION: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "s3")
    @IsString()
    S3_ENDPOINT: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "s3")
    @IsString()
    S3_ACCESS_KEY_ID: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "s3")
    @IsString()
    S3_SECRET_ACCESS_KEY: string;

    @ValidateIf((v) => v.BLOB_STORAGE_DRIVER === "s3")
    @IsString()
    S3_BUCKET: string;

    @IsUndefinable()
    @IsArray()
    @Transform(({ value }) => value.split(","))
    @IsEmail({}, { each: true })
    MAILER_SEND_ALL_MAILS_TO?: string[];

    @IsUndefinable()
    @IsArray()
    @Transform(({ value }) => value.split(","))
    @IsEmail({}, { each: true })
    MAILER_SEND_ALL_MAILS_BCC?: string[];

    @IsString()
    @ValidateIf(() => process.env.NODE_ENV === "production")
    CDN_ORIGIN_CHECK_SECRET: string;

    @ValidateIf((v) => v.AZURE_AI_TRANSLATOR_KEY || v.AZURE_AI_TRANSLATOR_REGION)
    @IsUrl()
    AZURE_AI_TRANSLATOR_ENDPOINT?: string;

    @ValidateIf((v) => v.AZURE_AI_TRANSLATOR_ENDPOINT || v.AZURE_AI_TRANSLATOR_REGION)
    @IsString()
    AZURE_AI_TRANSLATOR_KEY?: string;

    @ValidateIf((v) => v.AZURE_AI_TRANSLATOR_ENDPOINT || v.AZURE_AI_TRANSLATOR_KEY)
    @IsString()
    AZURE_AI_TRANSLATOR_REGION?: string;

    @ValidateIf((v) => v.AZURE_OPEN_AI_CONTENT_GENERATION_API_KEY || v.AZURE_OPEN_AI_CONTENT_GENERATION_DEPLOYMENT_ID)
    @IsString()
    AZURE_OPEN_AI_CONTENT_GENERATION_API_URL?: string;

    @ValidateIf((v) => v.AZURE_OPEN_AI_CONTENT_GENERATION_API_URL || v.AZURE_OPEN_AI_CONTENT_GENERATION_DEPLOYMENT_ID)
    @IsString()
    AZURE_OPEN_AI_CONTENT_GENERATION_API_KEY?: string;

    @ValidateIf((v) => v.AZURE_OPEN_AI_CONTENT_GENERATION_API_URL || v.AZURE_OPEN_AI_CONTENT_GENERATION_API_KEY)
    @IsString()
    AZURE_OPEN_AI_CONTENT_GENERATION_DEPLOYMENT_ID?: string;

    @IsOptional()
    @IsUrl()
    SENTRY_DSN?: string;

    @ValidateIf((v) => v.SENTRY_DSN)
    @IsString()
    SENTRY_ENVIRONMENT?: string;

    @IsString()
    @MinLength(16)
    FILE_UPLOADS_DOWNLOAD_SECRET: string;

    @IsString()
    @MinLength(16)
    SITE_PREVIEW_SECRET: string;

    @IsArray()
    @Transform(({ value }) => JSON.parse(Buffer.from(value, "base64").toString()))
    PRIVATE_SITE_CONFIGS: PrivateSiteConfig[];
}
