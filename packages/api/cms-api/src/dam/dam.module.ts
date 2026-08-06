import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Logger, Module, Type, ValueProvider } from "@nestjs/common";
import { TypeMetadataStorage } from "@nestjs/graphql";

import { BlobStorageModule, damDefaultAcceptedMimetypes, DependentsResolverFactory } from "..";
import { FileValidationService } from "../file-utils/file-validation.service";
import { ImgproxyModule } from "../imgproxy/imgproxy.module";
import { DamFileDownloadLinkBlockTransformerService } from "./blocks/dam-file-download-link-block-transformer.service";
import { PixelImageBlockTransformerService } from "./blocks/pixel-image-block-transformer.service";
import { SvgImageBlockTransformerService } from "./blocks/svg-image-block-transformer.service";
import { DamVideoBlockTransformerService } from "./blocks/video/dam-video-block-transformer.service";
import { HasValidFilenameConstraint } from "./common/decorators/has-valid-filename.decorator";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, DAM_FILE_VALIDATION_SERVICE } from "./dam.constants";
import { createDamItemsResolver } from "./files/dam-items.resolver";
import { DamItemsService } from "./files/dam-items.service";
import { createDamMediaAlternativeResolver } from "./files/dam-media-alternatives/dam-media-alternative.resolver";
import { DamMediaAlternative } from "./files/dam-media-alternatives/entities/dam-media-alternative.entity";
import { createFileEntity, FILE_ENTITY, FileInterface } from "./files/entities/file.entity";
import { DamFileImage } from "./files/entities/file-image.entity";
import { createFolderEntity, FolderInterface } from "./files/entities/folder.entity";
import { FileImagesResolver } from "./files/file-image.resolver";
import { FileLicensesResolver } from "./files/file-licenses.resolver";
import { FileWarningService } from "./files/file-warning.service";
import { createFilesController } from "./files/files.controller";
import { createFilesResolver } from "./files/files.resolver";
import { FilesService } from "./files/files.service";
import { createFoldersController } from "./files/folders.controller";
import { createFoldersResolver } from "./files/folders.resolver";
import { FoldersService } from "./files/folders.service";
import { CalculateDominantImageColorCommand } from "./images/calculateDominantImageColor.command";
import { ImageCropArea } from "./images/entities/image-crop-area.entity";
import { createImagesController } from "./images/images.controller";
import { ImagesService } from "./images/images.service";
import { IsAllowedImageAspectRatioConstraint } from "./images/validators/is-allowed-aspect-ratio.validator";
import { IsAllowedImageSizeConstraint } from "./images/validators/is-allowed-image-size.validator";
import { IsValidImageAspectRatioConstraint } from "./images/validators/is-valid-aspect-ratio.validator";
import { DamScopeInterface } from "./types";

interface DamModuleOptions {
    damConfig: Omit<DamConfig, "basePath"> & { basePath?: string };
    Scope?: Type<DamScopeInterface>;
    Folder?: Type<FolderInterface>;
    File?: Type<FileInterface>;
    // When true, only the file/folder upload/download HTTP endpoints and their services are registered. The GraphQL
    // resolvers, blocks, image serving and dependents resolver — and their dependencies on ImgproxyModule,
    // UserPermissionsModule and DependenciesModule — are skipped. Use this to provide the plain DAM file endpoints in a
    // standalone service (e.g. a separate public API microservice) without pulling in the full admin stack.
    fileOnly?: boolean;
    // The DAM file/folder endpoints perform scope-based access control only when an access control service is available
    // (provided by UserPermissionsModule). Set this to true to acknowledge that authorization is handled outside of the
    // DAM module (e.g. by an authentication guard in front of a standalone service). Without it, the endpoints fail
    // closed when no access control service is registered.
    disableScopeAccessControl?: boolean;
}

@Global()
@Module({})
export class DamModule {
    static register({
        Scope,
        Folder = createFolderEntity({ Scope }),
        File = createFileEntity({ Scope, Folder }),
        fileOnly = false,
        disableScopeAccessControl = false,
        ...options
    }: DamModuleOptions): DynamicModule {
        const damConfig = {
            ...options.damConfig,
            basePath: options.damConfig.basePath ?? "dam",
        };

        if (File.name !== FILE_ENTITY) {
            throw new Error(`DamModule: Your File entity must be named ${FILE_ENTITY}`);
        }

        if (disableScopeAccessControl) {
            new Logger(DamModule.name).warn(
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

        if (fileOnly) {
            return {
                module: DamModule,
                imports: [entitiesModule, BlobStorageModule],
                providers: [damConfigProvider, fileValidationServiceProvider, FilesService, FoldersService],
                controllers: [
                    createFilesController({ Scope, damBasePath: damConfig.basePath, disableScopeAccessControl }),
                    createFoldersController({ damBasePath: damConfig.basePath, disableScopeAccessControl }),
                ],
                exports: [entitiesModule, damConfigProvider, FilesService, FoldersService],
            };
        }

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
            imports: [entitiesModule, BlobStorageModule, ImgproxyModule],
            providers: [
                damConfigProvider,
                DamItemsResolver,
                DamItemsService,
                fileValidationServiceProvider,
                FilesResolver,
                FileDependentsResolver,
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
                createFilesController({ Scope, damBasePath: damConfig.basePath, disableScopeAccessControl }),
                createFoldersController({ damBasePath: damConfig.basePath, disableScopeAccessControl }),
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
