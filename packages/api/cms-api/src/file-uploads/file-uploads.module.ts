import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { FileValidationService } from "../dam/files/file-validation.service";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG, FILE_UPLOADS_FILE_VALIDATION_SERVICE } from "./file-uploads.constants";
import { createFileUploadsController } from "./file-uploads.controller";
import { FileUploadsService } from "./file-uploads.service";

@Global()
@Module({})
export class FileUploadsModule {
    static register(options: FileUploadsConfig): DynamicModule {
        const fileUploadsConfigProvider = {
            provide: FILE_UPLOADS_CONFIG,
            useValue: options,
        };

        const fileUploadsFileValidatorProvider = {
            provide: FILE_UPLOADS_FILE_VALIDATION_SERVICE,
            useValue: new FileValidationService({
                maxFileSize: options.maxFileSize,
                acceptedMimeTypes: options.acceptedMimeTypes,
            }),
        };
        return {
            module: FileUploadsModule,
            imports: [MikroOrmModule.forFeature([FileUpload]), BlobStorageModule],
            providers: [fileUploadsConfigProvider, FileUploadsService, fileUploadsFileValidatorProvider],
            controllers: [createFileUploadsController(options.upload ?? { public: false })],
            exports: [FileUploadsService],
        };
    }
}
