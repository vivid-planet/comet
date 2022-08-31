import { BlobStorageConfig } from "@comet/cms-api";
import { registerAs } from "@nestjs/config";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";

export class EnvironmentVariables {
    @IsString()
    @ValidateIf(() => process.env.NODE_ENV === "production")
    HELM_RELEASE: string;

    @IsString()
    POSTGRESQL_HOST: string;

    @IsOptional()
    @IsBoolean()
    @Transform((val) => val === "true")
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

    @Type(() => Number)
    @IsInt()
    API_PORT: number;

    @IsString()
    API_PASSWORD: string;

    @IsString()
    IDP_API_URL: string;

    @IsString()
    @ValidateIf(() => process.env.NODE_ENV === "production")
    IDP_API_PASSWORD: string;

    @IsString()
    IDP_CLIENT_ID: string;

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

    @Type(() => Number)
    @IsNumber()
    IMGPROXY_MAX_SRC_RESOLUTION: number;

    @IsString()
    @MinLength(16)
    DAM_SECRET: string;

    @IsString()
    DAM_ALLOWED_IMAGE_SIZES: string;

    @IsString()
    DAM_ALLOWED_IMAGE_ASPECT_RATIOS: string;

    @Type(() => Number)
    @IsInt()
    DAM_UPLOADS_MAX_FILE_SIZE: number;

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

    @Type(() => Number)
    @IsInt()
    PUBLIC_UPLOADS_MAX_FILE_SIZE: number;

    @ValidateIf((v) => v.DAM_STORAGE_DRIVER === "s3")
    @IsString()
    S3_REGION: string;

    @ValidateIf((v) => v.DAM_STORAGE_DRIVER === "s3")
    @IsString()
    S3_ENDPOINT: string;

    @ValidateIf((v) => v.DAM_STORAGE_DRIVER === "s3")
    @IsString()
    S3_ACCESS_KEY_ID: string;

    @ValidateIf((v) => v.DAM_STORAGE_DRIVER === "s3")
    @IsString()
    S3_SECRET_ACCESS_KEY: string;

    @IsOptional()
    @ValidateIf((v) => v.DAM_STORAGE_DRIVER === "s3")
    @IsString()
    S3_BUCKET?: string;
}

export function env<K extends keyof EnvironmentVariables>(name: K): EnvironmentVariables[K] {
    return (process.env as unknown as EnvironmentVariables)[name];
}

export const configNS = registerAs("config", () => ({
    ...(process.env as unknown as EnvironmentVariables),
    debug: process.env.NODE_ENV !== "production",
}));
