import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";
import { TypeMetadataStorage } from "@nestjs/graphql";

import { BlobStorageModule } from "../blob-storage/blob-storage.module.js";
import { DependentsResolverFactory } from "../dependencies/dependents.resolver.factory.js";
import { FileValidationService } from "../file-utils/file-validation.service.js";
import { ImgproxyModule } from "../imgproxy/imgproxy.module.js";
import { WarningsModule } from "../warnings/warning.module.js";
import { DamFileDownloadLinkBlockTransformerService } from "./blocks/dam-file-download-link-block-transformer.service.js";
import { PixelImageBlockTransformerService } from "./blocks/pixel-image-block-transformer.service.js";
import { SvgImageBlockTransformerService } from "./blocks/svg-image-block-transformer.service.js";
import { DamVideoBlockTransformerService } from "./blocks/video/dam-video-block-transformer.service.js";
import { HasValidFilenameConstraint } from "./common/decorators/has-valid-filename.decorator.js";
import { damDefaultAcceptedMimetypes } from "./common/mimeTypes/dam-default-accepted-mimetypes.js";
import { DamConfig } from "./dam.config.js";
import { DAM_CONFIG, DAM_FILE_VALIDATION_SERVICE } from "./dam.constants.js";
import { createDamItemsResolver } from "./files/dam-items.resolver.js";
import { DamItemsService } from "./files/dam-items.service.js";
import { createDamMediaAlternativeResolver } from "./files/dam-media-alternatives/dam-media-alternative.resolver.js";
import { DamMediaAlternative } from "./files/dam-media-alternatives/entities/dam-media-alternative.entity.js";
import { createFileEntity, FILE_ENTITY, FileInterface } from "./files/entities/file.entity.js";
import { DamFileImage } from "./files/entities/file-image.entity.js";
import { createFolderEntity, FolderInterface } from "./files/entities/folder.entity.js";
import { FileImagesResolver } from "./files/file-image.resolver.js";
import { FileLicensesResolver } from "./files/file-licenses.resolver.js";
import { FileWarningService } from "./files/file-warning.service.js";
import { createFilesController } from "./files/files.controller.js";
import { createFilesResolver } from "./files/files.resolver.js";
import { FilesService } from "./files/files.service.js";
import { FilesEntityInfoService } from "./files/files-entity-info.service.js";
import { createFoldersController } from "./files/folders.controller.js";
import { createFoldersResolver } from "./files/folders.resolver.js";
import { FoldersService } from "./files/folders.service.js";
import { CalculateDominantImageColorCommand } from "./images/calculateDominantImageColor.command.js";
import { ImageCropArea } from "./images/entities/image-crop-area.entity.js";
import { createImagesController } from "./images/images.controller.js";
import { ImagesService } from "./images/images.service.js";
import { IsAllowedImageAspectRatioConstraint } from "./images/validators/is-allowed-aspect-ratio.validator.js";
import { IsAllowedImageSizeConstraint } from "./images/validators/is-allowed-image-size.validator.js";
import { IsValidImageAspectRatioConstraint } from "./images/validators/is-valid-aspect-ratio.validator.js";
import { DamScopeInterface } from "./types.js";

interface DamModuleOptions {
    damConfig: Omit<DamConfig, "basePath"> & { basePath?: string };
    Scope?: Type<DamScopeInterface>;
    Folder?: Type<FolderInterface>;
    File?: Type<FileInterface>;
}

@Global()
@Module({})
export class DamModule {
    static register({
        Scope,
        Folder = createFolderEntity({ Scope }),
        File = createFileEntity({ Scope, Folder }),
        ...options
    }: DamModuleOptions): DynamicModule {
        const damConfig = {
            ...options.damConfig,
            basePath: options.damConfig.basePath ?? "dam",
        };

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
            module: DamModule,
            imports: [
                MikroOrmModule.forFeature([File, Folder, DamFileImage, ImageCropArea, DamMediaAlternative]),
                BlobStorageModule,
                ImgproxyModule,
                WarningsModule,
            ],
            providers: [
                damConfigProvider,
                DamItemsResolver,
                DamItemsService,
                fileValidationServiceProvider,
                FilesResolver,
                FileDependentsResolver,
                FilesEntityInfoService,
                FilesService,
                FileLicensesResolver,
                FoldersResolver,
                FoldersService,
                ImagesService,
                IsAllowedImageSizeConstraint,
                IsAllowedImageAspectRatioConstraint,
                IsValidImageAspectRatioConstraint,
                FileImagesResolver,
                CalculateDominantImageColorCommand,
                PixelImageBlockTransformerService,
                SvgImageBlockTransformerService,
                DamVideoBlockTransformerService,
                DamFileDownloadLinkBlockTransformerService,
                HasValidFilenameConstraint,
                FileWarningService,
                DamMediaAlternativeResolver,
            ],
            controllers: [
                createFilesController({ Scope, damBasePath: damConfig.basePath }),
                createFoldersController({ damBasePath: damConfig.basePath }),
                createImagesController({ damBasePath: damConfig.basePath }),
            ],
            exports: [
                FilesService,
                FoldersService,
                ImagesService,
                damConfigProvider,
                PixelImageBlockTransformerService,
                SvgImageBlockTransformerService,
                DamVideoBlockTransformerService,
            ],
        };
    }
}
