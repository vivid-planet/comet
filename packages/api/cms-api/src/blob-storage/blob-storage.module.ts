import { DynamicModule, Global, Module } from "@nestjs/common";

import { BlobStorageBackendService } from "./backends/blob-storage-backend.service";
import { BlobStorageConfig } from "./blob-storage.config";
import { BLOB_STORAGE_CONFIG } from "./blob-storage.constants";
import { ScaledImagesCacheService } from "./cache/scaled-images-cache.service";

@Global()
@Module({})
export class BlobStorageModule {
    static register(options: BlobStorageConfig): DynamicModule {
        const blobStorageConfigProvider = {
            provide: BLOB_STORAGE_CONFIG,
            useValue: options,
        };

        return {
            module: BlobStorageModule,
            providers: [blobStorageConfigProvider, BlobStorageBackendService, ScaledImagesCacheService],
            exports: [BlobStorageBackendService, blobStorageConfigProvider, ScaledImagesCacheService],
        };
    }
}
