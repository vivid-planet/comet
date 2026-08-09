import { DynamicModule, Global, Module } from "@nestjs/common";

import { DamFileDownloadLinkBlockTransformerService } from "./blocks/dam-file-download-link-block-transformer.service";
import { PixelImageBlockTransformerService } from "./blocks/pixel-image-block-transformer.service";
import { SvgImageBlockTransformerService } from "./blocks/svg-image-block-transformer.service";
import { DamVideoBlockTransformerService } from "./blocks/video/dam-video-block-transformer.service";

@Global()
@Module({})
export class DamBlocksModule {
    static register(): DynamicModule {
        return {
            module: DamBlocksModule,
            providers: [
                PixelImageBlockTransformerService,
                SvgImageBlockTransformerService,
                DamVideoBlockTransformerService,
                DamFileDownloadLinkBlockTransformerService,
            ],
            exports: [PixelImageBlockTransformerService, SvgImageBlockTransformerService, DamVideoBlockTransformerService],
        };
    }
}
