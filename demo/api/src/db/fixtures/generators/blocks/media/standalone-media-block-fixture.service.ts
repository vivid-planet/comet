import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { MediaAspectRatios } from "@src/util/mediaAspectRatios";

import { MediaTypeBlockFixtureService } from "./media-type-block.fixture.service";

@Injectable()
export class StandaloneMediaBlockFixtureService {
    constructor(private readonly mediaTypeBlockFixtureService: MediaTypeBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof StandaloneMediaBlock>> {
        return {
            media: await this.mediaTypeBlockFixtureService.generateBlockInput(),
            aspectRatio: faker.helpers.arrayElement(Object.values(MediaAspectRatios)),
        };
    }
}
