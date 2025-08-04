import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { MediaAspectRatios } from "@src/util/mediaAspectRatios";

import { MediaBlockFixtureService } from "./media-block.fixture.service";

@Injectable()
export class StandaloneMediaBlockFixtureService {
    constructor(private readonly mediaBlockFixtureService: MediaBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof StandaloneMediaBlock>> {
        return {
            media: await this.mediaBlockFixtureService.generateBlockInput(),
            aspectRatio: faker.helpers.arrayElement(Object.values(MediaAspectRatios)),
        };
    }
}
