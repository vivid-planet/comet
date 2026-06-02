import { DynamicModule, Global, Module, Type } from "@nestjs/common";
import { TypeMetadataStorage } from "@nestjs/graphql";

import { DependentsResolverFactory } from "..";
import { ImgproxyModule } from "../imgproxy/imgproxy.module";
import { DamFileDownloadLinkBlockTransformerService } from "./blocks/dam-file-download-link-block-transformer.service";
import { PixelImageBlockTransformerService } from "./blocks/pixel-image-block-transformer.service";
import { SvgImageBlockTransformerService } from "./blocks/svg-image-block-transformer.service";
import { DamVideoBlockTransformerService } from "./blocks/video/dam-video-block-transformer.service";
import { HasValidFilenameConstraint } from "./common/decorators/has-valid-filename.decorator";
import { DamConfig } from "./dam.config";
import { DamFileModule } from "./dam-file.module";
import { createDamItemsResolver } from "./files/dam-items.resolver";
import { DamItemsService } from "./files/dam-items.service";
import { createDamMediaAlternativeResolver } from "./files/dam-media-alternatives/dam-media-alternative.resolver";
import { createFileEntity, FileInterface } from "./files/entities/file.entity";
import { createFolderEntity, FolderInterface } from "./files/entities/folder.entity";
import { FileImagesResolver } from "./files/file-image.resolver";
import { FileLicensesResolver } from "./files/file-licenses.resolver";
import { FileWarningService } from "./files/file-warning.service";
import { createFilesResolver } from "./files/files.resolver";
import { createFoldersResolver } from "./files/folders.resolver";
import { CalculateDominantImageColorCommand } from "./images/calculateDominantImageColor.command";
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
            imports: [DamFileModule.register({ damConfig, Scope, Folder, File }), ImgproxyModule],
            providers: [
                DamItemsResolver,
                DamItemsService,
                FilesResolver,
                FileDependentsResolver,
                FileLicensesResolver,
                FoldersResolver,
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
            controllers: [createImagesController({ damBasePath: damConfig.basePath })],
            exports: [
                DamFileModule,
                ImagesService,
                PixelImageBlockTransformerService,
                SvgImageBlockTransformerService,
                DamVideoBlockTransformerService,
            ],
        };
    }
}
