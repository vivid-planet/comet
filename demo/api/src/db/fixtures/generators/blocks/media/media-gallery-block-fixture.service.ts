import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { MediaAspectRatios } from "@src/util/mediaAspectRatios";

import { MediaGalleryListBlockFixtureService } from "./media-gallery-list-block-fixture.service";

@Injectable()
export class MediaGalleryBlockFixtureService {
    constructor(private readonly mediaGalleryListBlockFixtureService: MediaGalleryListBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof MediaGalleryBlock>> {
        return {
            aspectRatio: faker.helpers.arrayElement(Object.values(MediaAspectRatios)),
            items: await this.mediaGalleryListBlockFixtureService.generateBlockInput(),
        };
    }
}
