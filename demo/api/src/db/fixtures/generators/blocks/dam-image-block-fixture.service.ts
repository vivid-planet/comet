import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { random } from "faker";

import { PixelImageBlockFixtureService } from "./pixel-image-block-fixture.service";
import { SvgImageBlockFixtureService } from "./svg-image-block-fixture.service";

@Injectable()
export class DamImageBlockFixtureService {
    constructor(
        private readonly svgImageBlockFixtureService: SvgImageBlockFixtureService,
        private readonly pixelImageBlockFixtureService: PixelImageBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof DamImageBlock>> {
        const types = ["svgImage", "pixelImage"] as const;
        const type = random.arrayElement(types);

        switch (type) {
            case "svgImage":
                return {
                    attachedBlocks: [{ type, props: await this.svgImageBlockFixtureService.generateBlockInput() }],
                    activeType: type,
                };
            case "pixelImage":
                return {
                    attachedBlocks: [{ type, props: await this.pixelImageBlockFixtureService.generateBlockInput() }],
                    activeType: type,
                };
        }
    }
}
