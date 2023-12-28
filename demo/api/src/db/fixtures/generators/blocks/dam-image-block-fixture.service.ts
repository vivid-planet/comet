import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { datatype } from "faker";

import { PixelImageBlockFixtureService } from "./pixel-image-block-fixture.service";
import { SvgImageBlockFixtureService } from "./svg-image-block-fixture.service";

@Injectable()
export class DamImageBlockFixtureService {
    constructor(
        private readonly svgImageBlockFixtureService: SvgImageBlockFixtureService,
        private readonly pixelImageBlockFixtureService: PixelImageBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof DamImageBlock>> {
        let type: "svgImage" | "pixelImage" = "pixelImage";
        let props = await this.pixelImageBlockFixtureService.generateBlock();

        if (datatype.boolean()) {
            type = "svgImage";
            props = await this.svgImageBlockFixtureService.generateBlock();
        }

        return {
            attachedBlocks: [
                {
                    type,
                    props,
                },
            ],
            activeType: type,
        };
    }
}
