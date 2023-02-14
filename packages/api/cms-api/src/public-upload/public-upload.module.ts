import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, ModuleMetadata } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadConfig } from "./public-upload.config";
import { PUBLIC_UPLOAD_CONFIG, PUBLIC_UPLOAD_MODULE_OPTIONS } from "./public-upload.constants";
import { PublicUploadsController } from "./public-uploads.controller";
import { PublicUploadsService } from "./public-uploads.service";

interface PublicUploadModuleOptions {
    publicUploadConfig: PublicUploadConfig;
}

interface PublicUploadModuleOptions extends Pick<ModuleMetadata, "imports"> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useFactory: (...args: any[]) => PublicUploadModuleOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inject?: any[];
}

@Global()
@Module({})
export class PublicUploadModule {
    static register(options: PublicUploadModuleOptions): DynamicModule {
        const optionsProvider = {
            provide: PUBLIC_UPLOAD_MODULE_OPTIONS,
            ...options,
        };

        const publicUploadConfigProvider = {
            provide: PUBLIC_UPLOAD_CONFIG,
            useFactory: (options: PublicUploadModuleOptions): PublicUploadConfig => {
                return options.publicUploadConfig;
            },
            inject: [PUBLIC_UPLOAD_MODULE_OPTIONS],
        };

        return {
            module: PublicUploadModule,
            imports: [...(options.imports ?? []), MikroOrmModule.forFeature([PublicUpload]), BlobStorageModule],
            providers: [optionsProvider, publicUploadConfigProvider, PublicUploadsService],
            controllers: [PublicUploadsController],
            exports: [PublicUploadsService],
        };
    }
}
