import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Logger, Module, Type, ValueProvider } from "@nestjs/common";

import { BlobStorageModule } from "../blob-storage/blob-storage.module";
import { FileValidationService } from "../file-utils/file-validation.service";
import { damDefaultAcceptedMimetypes } from "./common/mimeTypes/dam-default-accepted-mimetypes";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, DAM_DEFAULT_BASE_PATH, DAM_FILE_VALIDATION_SERVICE } from "./dam.constants";
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

interface DamCoreModuleOptions {
    damConfig: Omit<DamConfig, "basePath"> & { basePath?: string };
    Scope?: Type<DamScopeInterface>;
    Folder?: Type<FolderInterface>;
    File?: Type<FileInterface>;
    // The DAM file/folder endpoints perform scope-based access control only when an access control service is available.
    // Set this to true to acknowledge that authorization is handled outside of the DAM module (e.g. by an authentication
    // guard in front of a standalone service). Without it, the endpoints fail closed when no access control service is registered.
    disableScopeAccessControl?: boolean;
}

@Global()
@Module({})
export class DamCoreModule {
    private static registered = false;

    static register({
        Scope,
        Folder = createFolderEntity({ Scope }),
        File = createFileEntity({ Scope, Folder }),
        ...options
    }: DamCoreModuleOptions): DynamicModule {
        // Both modules are global and declare the same controllers. DamModule registers DamCoreModule internally, so
        // registering both would result in duplicate routes. Guard against it instead of leaving it to chance.
        if (DamCoreModule.registered) {
            throw new Error(
                "DamCoreModule has already been registered. It is registered automatically by DamModule, so register only one of the two.",
            );
        }
        DamCoreModule.registered = true;

        const damConfig = {
            ...options.damConfig,
            basePath: options.damConfig.basePath ?? DAM_DEFAULT_BASE_PATH,
        };

        if (File.name !== FILE_ENTITY) {
            throw new Error(`DamCoreModule: Your File entity must be named ${FILE_ENTITY}`);
        }

        if (options.disableScopeAccessControl) {
            new Logger(DamCoreModule.name).warn(
                "Scope-based access control is disabled. The DAM file and folder endpoints perform no authorization on their own — make sure they are protected by other means (e.g. an authentication guard).",
            );
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
            module: DamCoreModule,
            imports: [entitiesModule, BlobStorageModule],
            providers: [damConfigProvider, fileValidationServiceProvider, FilesService, FoldersService],
            controllers: [
                createFilesController({ Scope, damBasePath: damConfig.basePath, disableScopeAccessControl: options.disableScopeAccessControl }),
                createFoldersController({ damBasePath: damConfig.basePath, disableScopeAccessControl: options.disableScopeAccessControl }),
            ],
            exports: [entitiesModule, damConfigProvider, FilesService, FoldersService],
        };
    }
}
