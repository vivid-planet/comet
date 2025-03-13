import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Provider } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { FileValidationService } from "../dam/files/file-validation.service";
import { FileUpload } from "./entities/file-upload.entity";
import { FileUploadsConfig } from "./file-uploads.config";
import { FILE_UPLOADS_CONFIG, FILE_UPLOADS_FILE_VALIDATION_SERVICE } from "./file-uploads.constants";
import { FileUploadsResolver } from "./file-uploads.resolver";
import { FileUploadsService } from "./file-uploads.service";
import { createFileUploadsDownloadController } from "./file-uploads-download.controller";
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
        const providers: Provider[] = [fileUploadsConfigProvider, FileUploadsService, fileUploadsFileValidatorProvider];

        if (options.download) {
            if (options.download.secret.length < 16) {
                throw new Error("The download secret must be at least 16 characters long.");
            }

            const FileUploadsDownloadController = createFileUploadsDownloadController({ public: options.download.public ?? false });
            controllers.push(FileUploadsDownloadController);
            providers.push(FileUploadsResolver);
        }

        return {
            module: FileUploadsModule,
            imports: [MikroOrmModule.forFeature([FileUpload]), BlobStorageModule],
            providers,
            controllers,
            exports: [FileUploadsService],
        };
    }
}
