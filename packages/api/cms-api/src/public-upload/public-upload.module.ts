import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadConfig } from "./public-upload.config";
import { PUBLIC_UPLOAD_CONFIG } from "./public-upload.constants";
import { PublicUploadsController } from "./public-uploads.controller";
import { PublicUploadsService } from "./public-uploads.service";

@Global()
@Module({})
export class PublicUploadModule {
    static register(options: PublicUploadConfig): DynamicModule {
        const publicUploadConfigProvider = {
            provide: PUBLIC_UPLOAD_CONFIG,
            useValue: options,
        };

        return {
            module: PublicUploadModule,
            imports: [MikroOrmModule.forFeature([PublicUpload]), BlobStorageModule],
            providers: [publicUploadConfigProvider, PublicUploadsService],
            controllers: [PublicUploadsController],
            exports: [PublicUploadsService],
        };
    }
}
