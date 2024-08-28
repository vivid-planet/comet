import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { FileValidationService } from "../dam/files/file-validation.service";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG, FILE_UPLOADS_FILE_VALIDATION_SERVICE } from "./file-uploads.constants";
import { FileUploadsService } from "./file-uploads.service";
import { FileUploadsDownloadController } from "./file-uploads-download.controller";
import { createFileUploadsUploadController } from "./file-uploads-upload.controller";

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

        const controllers = [createFileUploadsUploadController(options.upload ?? { public: false })];

        // TODO should we validate the secret more (min length, etc.)?
        if (options.download) {
            if (options.download.secret.length < 16) {
                throw new Error("The download secret must be at least 16 characters long.");
            }

            controllers.push(FileUploadsDownloadController);
        }

        return {
            module: FileUploadsModule,
            imports: [MikroOrmModule.forFeature([FileUpload]), BlobStorageModule],
            providers: [fileUploadsConfigProvider, FileUploadsService, fileUploadsFileValidatorProvider],
            controllers,
            exports: [FileUploadsService],
        };
    }
}
