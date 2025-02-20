import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";
import { TypeMetadataStorage } from "@nestjs/graphql";

import { BlobStorageModule, damDefaultAcceptedMimetypes, DependentsResolverFactory } from "..";
import { DamFileDownloadLinkBlockTransformerService } from "./blocks/dam-file-download-link-block-transformer.service";
import { PixelImageBlockTransformerService } from "./blocks/pixel-image-block-transformer.service";
import { SvgImageBlockTransformerService } from "./blocks/svg-image-block-transformer.service";
import { DamVideoBlockTransformerService } from "./blocks/video/dam-video-block-transformer.service";
import { ScaledImagesCacheService } from "./cache/scaled-images-cache.service";
import { HasValidFilenameConstraint } from "./common/decorators/has-valid-filename.decorator";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, DAM_FILE_VALIDATION_SERVICE, IMGPROXY_CONFIG } from "./dam.constants";
import { createDamItemsResolver } from "./files/dam-items.resolver";
import { DamItemsService } from "./files/dam-items.service";
import { createFileEntity, FILE_ENTITY, FileInterface } from "./files/entities/file.entity";
import { DamFileImage } from "./files/entities/file-image.entity";
import { createFolderEntity, FolderInterface } from "./files/entities/folder.entity";
import { FileImagesResolver } from "./files/file-image.resolver";
import { FileLicensesResolver } from "./files/file-licenses.resolver";
import { FileValidationService } from "./files/file-validation.service";
import { createFilesController } from "./files/files.controller";
import { createFilesResolver } from "./files/files.resolver";
import { FilesService } from "./files/files.service";
import { FilesEntityInfoService } from "./files/files-entity-info.service";
import { FoldersController } from "./files/folders.controller";
import { createFoldersResolver } from "./files/folders.resolver";
import { FoldersService } from "./files/folders.service";
import { CalculateDominantImageColorCommand } from "./images/calculateDominantImageColor.command";
import { ImageCropArea } from "./images/entities/image-crop-area.entity";
import { ImagesController } from "./images/images.controller";
import { ImagesService } from "./images/images.service";
import { IsAllowedImageAspectRatioConstraint } from "./images/validators/is-allowed-aspect-ratio.validator";
import { IsAllowedImageSizeConstraint } from "./images/validators/is-allowed-image-size.validator";
import { IsValidImageAspectRatioConstraint } from "./images/validators/is-valid-aspect-ratio.validator";
import { ImgproxyConfig, ImgproxyService } from "./imgproxy/imgproxy.service";
import { DamScopeInterface } from "./types";

interface DamModuleOptions {
    damConfig: DamConfig;
    imgproxyConfig: ImgproxyConfig;
    Scope?: Type<DamScopeInterface>;
    Folder?: Type<FolderInterface>;
    File?: Type<FileInterface>;
}

@Global()
@Module({})
export class DamModule {
    static register({
        damConfig,
        imgproxyConfig,
        Scope,
        Folder = createFolderEntity({ Scope }),
        File = createFileEntity({ Scope, Folder }),
    }: DamModuleOptions): DynamicModule {
        if (File.name !== FILE_ENTITY) {
            throw new Error(`DamModule: Your File entity must be named ${FILE_ENTITY}`);
        }

        const damConfigProvider: ValueProvider<DamConfig> = {
            provide: DAM_CONFIG,
            useValue: damConfig,
        };

        const imgproxyConfigProvider: ValueProvider<ImgproxyConfig> = {
            provide: IMGPROXY_CONFIG,
            useValue: imgproxyConfig,
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
            imports: [MikroOrmModule.forFeature([File, Folder, DamFileImage, ImageCropArea]), BlobStorageModule],
            providers: [
                damConfigProvider,
                DamItemsResolver,
                DamItemsService,
                imgproxyConfigProvider,
                fileValidationServiceProvider,
                ScaledImagesCacheService,
                ImgproxyService,
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
                FileValidationService,
                PixelImageBlockTransformerService,
                SvgImageBlockTransformerService,
                DamVideoBlockTransformerService,
                DamFileDownloadLinkBlockTransformerService,
                HasValidFilenameConstraint,
            ],
            controllers: [createFilesController({ Scope }), FoldersController, ImagesController],
            exports: [
                ImgproxyService,
                FilesService,
                FoldersService,
                ImagesService,
                ScaledImagesCacheService,
                damConfigProvider,
                PixelImageBlockTransformerService,
                SvgImageBlockTransformerService,
                DamVideoBlockTransformerService,
            ],
        };
    }
}
