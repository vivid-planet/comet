import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { FileValidationService } from "../file-utils/file-validation.service";
import { damDefaultAcceptedMimetypes } from "./common/mimeTypes/dam-default-accepted-mimetypes";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, DAM_FILE_VALIDATION_SERVICE } from "./dam.constants";
import { DamMediaAlternative } from "./files/dam-media-alternatives/entities/dam-media-alternative.entity";
import { createFileEntity, FILE_ENTITY, FileInterface } from "./files/entities/file.entity";
import { DamFileImage } from "./files/entities/file-image.entity";
import { createFolderEntity, FolderInterface } from "./files/entities/folder.entity";
import { createFilesController } from "./files/files.controller";
import { FilesService } from "./files/files.service";
import { createFoldersController } from "./files/folders.controller";
import { FoldersService } from "./files/folders.service";
import { ImageCropArea } from "./images/entities/image-crop-area.entity";
import { DamScopeInterface } from "./types";

interface DamFileModuleOptions {
    damConfig: Omit<DamConfig, "basePath"> & { basePath?: string };
    Scope?: Type<DamScopeInterface>;
    Folder?: Type<FolderInterface>;
    File?: Type<FileInterface>;
}

@Global()
@Module({})
export class DamFileModule {
    static register({
        Scope,
        Folder = createFolderEntity({ Scope }),
        File = createFileEntity({ Scope, Folder }),
        ...options
    }: DamFileModuleOptions): DynamicModule {
        const damConfig = {
            ...options.damConfig,
            basePath: options.damConfig.basePath ?? "dam",
        };

        if (File.name !== FILE_ENTITY) {
            throw new Error(`DamFileModule: Your File entity must be named ${FILE_ENTITY}`);
        }

        const damConfigProvider: ValueProvider<DamConfig> = {
            provide: DAM_CONFIG,
            useValue: damConfig,
        };

        const fileValidationServiceProvider = {
            provide: DAM_FILE_VALIDATION_SERVICE,
            useValue: new FileValidationService({
                maxFileSize: damConfig.maxFileSize,
                acceptedMimeTypes: damConfig.acceptedMimeTypes ?? damDefaultAcceptedMimetypes,
            }),
        };

        const entitiesModule = MikroOrmModule.forFeature([File, Folder, DamFileImage, ImageCropArea, DamMediaAlternative]);

        return {
            module: DamFileModule,
            imports: [entitiesModule, BlobStorageModule],
            providers: [damConfigProvider, fileValidationServiceProvider, FilesService, FoldersService],
            controllers: [
                createFilesController({ Scope, damBasePath: damConfig.basePath }),
                createFoldersController({ damBasePath: damConfig.basePath }),
            ],
            exports: [entitiesModule, damConfigProvider, FilesService, FoldersService],
        };
    }
}
