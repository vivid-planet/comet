import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { MediaGalleryItemBlock } from "@src/common/blocks/media-gallery-item.block";

import { MediaTypeBlockFixtureService } from "./media-type-block.fixture.service";

@Injectable()
export class MediaGalleryItemBlockFixtureService {
    constructor(private readonly mediaTypeBlockFixtureService: MediaTypeBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof MediaGalleryItemBlock>> {
        return {
            media: await this.mediaTypeBlockFixtureService.generateBlockInput(),
            caption: faker.lorem.words({ min: 3, max: 9 }),
        };
    }
}
