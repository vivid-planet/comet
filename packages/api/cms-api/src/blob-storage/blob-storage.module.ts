import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { BlobStorageBackendService } from "./backends/blob-storage-backend.service";
import { BlobStorageConfig } from "./blob-storage.config";
import { BLOB_STORAGE_CONFIG, BLOB_STORAGE_MODULE_OPTIONS } from "./blob-storage.constants";

interface BlobStorageModuleOptions {
    blobStorageConfig: BlobStorageConfig;
}

interface BlobStorageModuleOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => BlobStorageModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Global()
@Module({})
export class BlobStorageModule {
    static register(options: BlobStorageModuleOptions): DynamicModule {
        const optionsProvider = {
            provide: BLOB_STORAGE_MODULE_OPTIONS,
            ...options,
        };

        const blobStorageConfigProvider = {
            provide: BLOB_STORAGE_CONFIG,
            useFactory: (options: BlobStorageModuleOptions): BlobStorageConfig => {
                return options.blobStorageConfig;
            },
            inject: [BLOB_STORAGE_MODULE_OPTIONS],
        };

        return {
            module: BlobStorageModule,
            imports: [...(options.imports ?? [])],
            providers: [optionsProvider, blobStorageConfigProvider, BlobStorageBackendService],
            exports: [BlobStorageBackendService, blobStorageConfigProvider],
        };
    }
}
