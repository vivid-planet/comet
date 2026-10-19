export interface StaticAssetsStorage {
    uploadFile(key: string, filePath: string): Promise<void>;
}

export type StaticAssetsStorageConfig =
    | { driver: "file"; file: { directory: string } }
    | {
          driver: "s3";
          s3: { bucket: string; region: string; endpoint?: string; accessKeyId?: string; secretAccessKey?: string };
      }
    | { driver: "azure"; azure: { accountName: string; accountKey: string; container: string } };

export async function createStaticAssetsStorage(config: StaticAssetsStorageConfig): Promise<StaticAssetsStorage> {
    switch (config.driver) {
        case "file": {
            const { FileStaticAssetsStorage } = await import("./file-storage");
            return new FileStaticAssetsStorage(config.file);
        }
        case "s3": {
            const { S3StaticAssetsStorage } = await import("./s3-storage");
            return new S3StaticAssetsStorage(config.s3);
        }
        case "azure": {
            const { AzureStaticAssetsStorage } = await import("./azure-storage");
            return new AzureStaticAssetsStorage(config.azure);
        }
    }
}
