import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";
import { TypeMetadataStorage } from "@nestjs/graphql";

import { damDefaultAcceptedMimetypes, DependentsResolverFactory } from "..";
import { FileValidationService } from "../file-utils/file-validation.service";
import { HasValidFilenameConstraint } from "./common/decorators/has-valid-filename.decorator";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, DAM_FILE_VALIDATION_SERVICE } from "./dam.constants";
import { DamFileCopyService } from "./files/dam-file-copy.service";
import { DamFolderZipService } from "./files/dam-folder-zip.service";
import { createDamItemsResolver } from "./files/dam-items.resolver";
import { DamItemsService } from "./files/dam-items.service";
import { createDamMediaAlternativeResolver } from "./files/dam-media-alternatives/dam-media-alternative.resolver";
import { DamMediaAlternative } from "./files/dam-media-alternatives/entities/dam-media-alternative.entity";
import { FILE_ENTITY, FileInterface } from "./files/entities/file.entity";
import { DamFileImage } from "./files/entities/file-image.entity";
import { FolderInterface } from "./files/entities/folder.entity";
import { FileLicensesResolver } from "./files/file-licenses.resolver";
import { FileWarningService } from "./files/file-warning.service";
import { createFilesController } from "./files/files.controller";
import { createFilesResolver } from "./files/files.resolver";
import { FilesService } from "./files/files.service";
import { createFoldersController } from "./files/folders.controller";
import { createFoldersResolver } from "./files/folders.resolver";
import { FoldersService } from "./files/folders.service";
import { ImageCropArea } from "./images/entities/image-crop-area.entity";
import { DamScopeInterface } from "./types";

export interface DamFilesModuleOptions {
    damConfig: DamConfig;
    Scope?: Type<DamScopeInterface>;
    Folder: Type<FolderInterface>;
    File: Type<FileInterface>;
}

@Global()
@Module({})
export class DamFilesModule {
    static register({ damConfig, Scope, Folder, File }: DamFilesModuleOptions): DynamicModule {
        if (File.name !== FILE_ENTITY) {
            throw new Error(`DamModule: Your File entity must be named ${FILE_ENTITY}`);
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

        const DamItemsResolver = createDamItemsResolver({ File, Folder, Scope });
        const FilesResolver = createFilesResolver({ File, Folder, Scope });
        const FileDependentsResolver = DependentsResolverFactory.create(File);
        const FoldersResolver = createFoldersResolver({ Folder, Scope });
        const DamMediaAlternativeResolver = createDamMediaAlternativeResolver({ File, Scope });

        if (Scope) {
            // Scope validation needs to happen after resolver generation. Otherwise the input type metadata has not been defined yet.
            const scopeObjectType = TypeMetadataStorage.getObjectTypeMetadataByTarget(Scope);

            if (scopeObjectType?.name !== "DamScope") {
                throw new Error(
                    `Invalid object type name for provided DAM scope class. Make sure to decorate the class with @ObjectType("DamScope")`,
                );
            }

            const scopeInputType = TypeMetadataStorage.getInputTypeMetadataByTarget(Scope);

            if (scopeInputType?.name !== "DamScopeInput") {
                throw new Error(
                    `Invalid input type name for provided DAM scope class. Make sure to decorate the class with @InputType("DamScopeInput")`,
                );
            }
        }

        return {
            module: DamFilesModule,
            imports: [MikroOrmModule.forFeature([File, Folder, DamFileImage, ImageCropArea, DamMediaAlternative])],
            providers: [
                damConfigProvider,
                fileValidationServiceProvider,
                DamItemsResolver,
                DamItemsService,
                FilesResolver,
                FileDependentsResolver,
                FilesService,
                FileLicensesResolver,
                FoldersResolver,
                FoldersService,
                DamFileCopyService,
                DamFolderZipService,
                HasValidFilenameConstraint,
                FileWarningService,
                DamMediaAlternativeResolver,
            ],
            controllers: [
                createFilesController({ Scope, damBasePath: damConfig.basePath }),
                createFoldersController({ damBasePath: damConfig.basePath }),
            ],
            exports: [FilesService, FoldersService, DamItemsService, DamFileCopyService, DamFolderZipService, damConfigProvider],
        };
    }
}
