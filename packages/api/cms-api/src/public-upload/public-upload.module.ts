import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { FileValidationService } from "src/dam/files/file-validation.service";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { PublicUpload } from "./entities/public-upload.entity";
import { PublicUploadConfig } from "./public-upload.config";
import { PUBLIC_UPLOAD_CONFIG, PUBLIC_UPLOAD_FILE_VALIDATION_SERVICE } from "./public-upload.constants";
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

        const publicUploadFileValidatorProvider = {
            provide: PUBLIC_UPLOAD_FILE_VALIDATION_SERVICE,
            useValue: new FileValidationService({
                maxFileSize: options.maxFileSize,
                acceptedMimeTypes: options.acceptedMimeTypes,
            }),
        };
        return {
            module: PublicUploadModule,
            imports: [MikroOrmModule.forFeature([PublicUpload]), BlobStorageModule],
            providers: [publicUploadConfigProvider, PublicUploadsService, publicUploadFileValidatorProvider],
            controllers: [PublicUploadsController],
            exports: [PublicUploadsService],
        };
    }
}
