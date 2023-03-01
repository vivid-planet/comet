import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DynamicModule, Global, Module } from "@nestjs/common";

import { BlobStorageModule, BlocksModule } from "..";
import { ScaledImagesCacheService } from "./cache/scaled-images-cache.service";
import { DamConfig } from "./dam.config";
import { DAM_CONFIG, IMGPROXY_CONFIG } from "./dam.constants";
import { DamItemsResolver } from "./files/dam-items.resolver";
import { DamItemsService } from "./files/dam-items.service";
import { File } from "./files/entities/file.entity";
import { FileImage } from "./files/entities/file-image.entity";
import { Folder } from "./files/entities/folder.entity";
import { FileImagesResolver } from "./files/file-image.resolver";
import { FilesController } from "./files/files.controller";
import { FilesResolver } from "./files/files.resolver";
import { FilesService } from "./files/files.service";
import { FoldersResolver } from "./files/folders.resolver";
import { FoldersService } from "./files/folders.service";
import { CalculateDominantImageColor } from "./images/calculateDominantImageColor.console";
import { ImageCropArea } from "./images/entities/image-crop-area.entity";
import { ImagesController } from "./images/images.controller";
import { ImagesService } from "./images/images.service";
import { IsAllowedImageAspectRatioConstraint } from "./images/validators/is-allowed-aspect-ratio.validator";
import { IsAllowedImageSizeConstraint } from "./images/validators/is-allowed-image-size.validator";
import { IsValidImageAspectRatioConstraint } from "./images/validators/is-valid-aspect-ratio.validator";
import { ImgproxyConfig, ImgproxyService } from "./imgproxy/imgproxy.service";

interface DamModuleOptions {
    damConfig: DamConfig;
    imgproxyConfig: ImgproxyConfig;
}

@Global()
@Module({})
export class DamModule {
    static register(options: DamModuleOptions): DynamicModule {
        const damConfigProvider = {
            provide: DAM_CONFIG,
            useValue: options.damConfig,
        };

        const imgproxyConfigProvider = {
            provide: IMGPROXY_CONFIG,
            useValue: options.imgproxyConfig,
        };

        return {
            module: DamModule,
            imports: [MikroOrmModule.forFeature([File, Folder, FileImage, ImageCropArea]), BlobStorageModule, BlocksModule],
            providers: [
                damConfigProvider,
                DamItemsResolver,
                DamItemsService,
                imgproxyConfigProvider,
                ScaledImagesCacheService,
                ImgproxyService,
                FilesResolver,
                FilesService,
                FoldersResolver,
                FoldersService,
                ImagesService,
                IsAllowedImageSizeConstraint,
                IsAllowedImageAspectRatioConstraint,
                IsValidImageAspectRatioConstraint,
                FileImagesResolver,
                CalculateDominantImageColor,
            ],
            controllers: [FilesController, ImagesController],
            exports: [ImgproxyService, FilesService, FoldersService, ImagesService, ScaledImagesCacheService, damConfigProvider],
        };
    }
}
