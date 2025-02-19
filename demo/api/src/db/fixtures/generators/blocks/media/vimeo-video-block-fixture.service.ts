import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { VimeoVideoBlock } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { PixelImageBlockFixtureService } from "./pixel-image-block-fixture.service";

@Injectable()
export class VimeoVideoBlockFixtureService {
    constructor(private readonly pixelImageBlockFixtureService: PixelImageBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof VimeoVideoBlock>> {
        const identifier = ["Ye8Oih0oxWs", "erpaPEGn7X0"];
        const autoplay = faker.datatype.boolean();

        return {
            autoplay,
            loop: faker.datatype.boolean(),
            showControls: !autoplay,
            vimeoIdentifier: faker.helpers.arrayElement(identifier),
            previewImage: await this.pixelImageBlockFixtureService.generateBlockInput(),
        };
    }
}
