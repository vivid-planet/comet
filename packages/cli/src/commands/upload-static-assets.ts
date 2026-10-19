/* eslint-disable no-console */
import { Command, Option } from "commander";
import { resolve } from "path";

import type { StaticAssetsStorageConfig } from "../static-assets/storage";
import { uploadStaticAssets } from "../static-assets/upload-static-assets";

type Options = {
    sourceDirectory: string;
    prefix: string;
    driver: StaticAssetsStorageConfig["driver"];
    fileDirectory?: string;
    s3Bucket?: string;
    s3Region?: string;
    s3Endpoint?: string;
    s3AccessKeyId?: string;
    s3SecretAccessKey?: string;
    azureAccountName?: string;
    azureAccountKey?: string;
    azureContainer?: string;
};

function requireOption<T>({ value, flag, driver }: { value: T | undefined; flag: string; driver: string }): T {
    if (value === undefined || value === "") {
        throw new Error(`${flag} is required for the ${driver} driver`);
    }
    return value;
}

function getStaticAssetsStorageConfig(options: Options): StaticAssetsStorageConfig {
    switch (options.driver) {
        case "file":
            return {
                driver: "file",
                file: { directory: resolve(requireOption({ value: options.fileDirectory, flag: "--file-directory", driver: "file" })) },
            };
        case "s3":
            return {
                driver: "s3",
                s3: {
                    bucket: requireOption({ value: options.s3Bucket, flag: "--s3-bucket", driver: "s3" }),
                    region: requireOption({ value: options.s3Region, flag: "--s3-region", driver: "s3" }),
                    endpoint: options.s3Endpoint || undefined,
                    accessKeyId: options.s3AccessKeyId || undefined,
                    secretAccessKey: options.s3SecretAccessKey || undefined,
                },
            };
        case "azure":
            return {
                driver: "azure",
                azure: {
                    accountName: requireOption({ value: options.azureAccountName, flag: "--azure-account-name", driver: "azure" }),
                    accountKey: requireOption({ value: options.azureAccountKey, flag: "--azure-account-key", driver: "azure" }),
                    container: requireOption({ value: options.azureContainer, flag: "--azure-container", driver: "azure" }),
                },
            };
    }
}

const envPrefix = "STATIC_ASSETS_STORAGE";

export const uploadStaticAssetsCommand = new Command("upload-static-assets")
    .description(
        "Upload static build assets (e.g., .next/static) to a storage that keeps the files of all deployed builds, so that every pod can serve them during a rolling deployment",
    )
    .addOption(new Option("--source-directory <directory>", "Directory to upload, e.g., .next/static").makeOptionMandatory())
    .addOption(
        new Option("--prefix <prefix>", "Key prefix in the storage, e.g. the environment name").env(`${envPrefix}_PREFIX`).makeOptionMandatory(),
    )
    .addOption(new Option("--driver <driver>", "Storage driver").choices(["file", "s3", "azure"]).env(`${envPrefix}_DRIVER`).makeOptionMandatory())
    .addOption(new Option("--file-directory <directory>", "Target directory (file driver)").env(`${envPrefix}_FILE_DIRECTORY`))
    .addOption(new Option("--s3-bucket <bucket>", "Bucket name (s3 driver)").env(`${envPrefix}_S3_BUCKET`))
    .addOption(new Option("--s3-region <region>", "Region (s3 driver)").env(`${envPrefix}_S3_REGION`))
    .addOption(new Option("--s3-endpoint <url>", "Endpoint for S3-compatible storages (s3 driver)").env(`${envPrefix}_S3_ENDPOINT`))
    .addOption(new Option("--s3-access-key-id <id>", "Access key ID (s3 driver)").env(`${envPrefix}_S3_ACCESS_KEY_ID`))
    .addOption(new Option("--s3-secret-access-key <key>", "Secret access key (s3 driver)").env(`${envPrefix}_S3_SECRET_ACCESS_KEY`))
    .addOption(new Option("--azure-account-name <name>", "Storage account name (azure driver)").env(`${envPrefix}_AZURE_ACCOUNT_NAME`))
    .addOption(new Option("--azure-account-key <key>", "Storage account key (azure driver)").env(`${envPrefix}_AZURE_ACCOUNT_KEY`))
    .addOption(new Option("--azure-container <container>", "Container name (azure driver)").env(`${envPrefix}_AZURE_CONTAINER`))
    .action(async (options: Options) => {
        const sourceDirectory = resolve(options.sourceDirectory);
        console.log(`upload-static-assets: Uploading ${sourceDirectory} to ${options.driver} storage with prefix ${options.prefix}`);

        const uploadedFiles = await uploadStaticAssets({
            sourceDirectory,
            prefix: options.prefix,
            storage: getStaticAssetsStorageConfig(options),
        });

        console.log(`upload-static-assets: Uploaded ${uploadedFiles.length} files`);
    });
