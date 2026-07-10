import { DynamicModule, Global, Module } from "@nestjs/common";

import { DAM_DOMINANT_COLOR_CALCULATOR } from "./dam.constants";
import { FileImagesResolver } from "./files/file-image.resolver";
import { CalculateDominantImageColorCommand } from "./images/calculateDominantImageColor.command";
import { DamDominantColorService } from "./images/dam-dominant-color.service";
import { createImagesController } from "./images/images.controller";
import { ImagesService } from "./images/images.service";
import { IsAllowedImageAspectRatioConstraint } from "./images/validators/is-allowed-aspect-ratio.validator";
import { IsAllowedImageSizeConstraint } from "./images/validators/is-allowed-image-size.validator";
import { IsValidImageAspectRatioConstraint } from "./images/validators/is-valid-aspect-ratio.validator";

export interface DamImagesModuleOptions {
    damBasePath: string;
}

@Global()
@Module({})
export class DamImagesModule {
    static register({ damBasePath }: DamImagesModuleOptions): DynamicModule {
        return {
            module: DamImagesModule,
            providers: [
                ImagesService,
                DamDominantColorService,
                { provide: DAM_DOMINANT_COLOR_CALCULATOR, useExisting: DamDominantColorService },
                CalculateDominantImageColorCommand,
                FileImagesResolver,
                IsAllowedImageSizeConstraint,
                IsAllowedImageAspectRatioConstraint,
                IsValidImageAspectRatioConstraint,
            ],
            controllers: [createImagesController({ damBasePath })],
            exports: [ImagesService, DAM_DOMINANT_COLOR_CALCULATOR],
        };
    }
}
