import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";

import { MediaGalleryItemBlockFixtureService } from "./media-gallery-item-block-fixture.service";

@Injectable()
export class MediaGalleryBlockFixtureService {
    constructor(private readonly mediaGalleryItemBlockFixtureService: MediaGalleryItemBlockFixtureService) {}

    async generateBlockInput(min = 2, max = 6): Promise<ExtractBlockInputFactoryProps<typeof MediaGalleryBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.mediaGalleryItemBlockFixtureService.generateBlockInput(),
            });
        }

        return {
            blocks: blocks,
        };
    }
}
