import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module, Type, ValueProvider } from "@nestjs/common";

import { BlobStorageModule } from "..";
import { ScaledImagesCacheService } from "./cache/scaled-images-cache.service";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, IMGPROXY_CONFIG } from "./dam.constants";
import { createDamItemsResolver } from "./files/dam-items.resolver";
import { DamItemsService } from "./files/dam-items.service";
import { createFileEntity } from "./files/entities/file.entity";
import { FileImage } from "./files/entities/file-image.entity";
import { createFolderEntity } from "./files/entities/folder.entity";
import { FileImagesResolver } from "./files/file-image.resolver";
import { createFilesController } from "./files/files.controller";
import { createFilesResolver } from "./files/files.resolver";
import { FilesService } from "./files/files.service";
import { createFoldersResolver } from "./files/folders.resolver";
import { FoldersService } from "./files/folders.service";
import { CalculateDominantImageColor } from "./images/calculateDominantImageColor.console";
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
}

@Global()
@Module({})
export class DamModule {
    static register({ damConfig, imgproxyConfig, Scope }: DamModuleOptions): DynamicModule {
        const damConfigProvider: ValueProvider<DamConfig> = {
            provide: DAM_CONFIG,
            useValue: damConfig,
        };

        const imgproxyConfigProvider: ValueProvider<ImgproxyConfig> = {
            provide: IMGPROXY_CONFIG,
            useValue: imgproxyConfig,
        };

        const Folder = createFolderEntity({ Scope });
        const File = createFileEntity({ Scope, Folder });

        return {
            module: DamModule,
            imports: [MikroOrmModule.forFeature([File, Folder, FileImage, ImageCropArea]), BlobStorageModule],
            providers: [
                damConfigProvider,
                createDamItemsResolver({ File, Folder, Scope }),
                DamItemsService,
                imgproxyConfigProvider,
                ScaledImagesCacheService,
                ImgproxyService,
                createFilesResolver({ File, Scope }),
                FilesService,
                createFoldersResolver({ Folder, Scope }),
                FoldersService,
                ImagesService,
                IsAllowedImageSizeConstraint,
                IsAllowedImageAspectRatioConstraint,
                IsValidImageAspectRatioConstraint,
                FileImagesResolver,
                CalculateDominantImageColor,
            ],
            controllers: [createFilesController({ Scope }), ImagesController],
            exports: [ImgproxyService, FilesService, FoldersService, ImagesService, ScaledImagesCacheService, damConfigProvider],
        };
    }
}
