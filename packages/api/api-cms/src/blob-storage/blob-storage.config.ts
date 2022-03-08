import { BlobStorageAzureConfig } from "./backends/azure/blob-storage-azure.config";
import { BlobStorageFileConfig } from "./backends/file/blob-storage-file.config";
import { BlobStorageS3Config } from "./backends/s3/blob-storage-s3.config";

export interface BlobStorageConfig {
    backend: BlobStorageFileConfig | BlobStorageAzureConfig | BlobStorageS3Config;
}
