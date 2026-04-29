import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { MediaDownloadBlock, MediaDownloadImageListBlock, MediaDownloadVideoListBlock } from "@src/documents/pages/blocks/media-download.block";

import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";
import { DamVideoBlockFixtureService } from "./dam-video-block-fixture.service";

@Injectable()
export class MediaDownloadBlockFixtureService {
    constructor(
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly damVideoBlockFixtureService: DamVideoBlockFixtureService,
    ) {}

    private async generateImageList(min = 1, max = 3): Promise<ExtractBlockInputFactoryProps<typeof MediaDownloadImageListBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.damImageBlockFixtureService.generateBlockInput(),
            });
        }

        return { blocks };
    }

    private async generateVideoList(min = 1, max = 2): Promise<ExtractBlockInputFactoryProps<typeof MediaDownloadVideoListBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.damVideoBlockFixtureService.generateBlockInput(),
            });
        }

        return { blocks };
    }

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof MediaDownloadBlock>> {
        return {
            images: await this.generateImageList(),
            videos: await this.generateVideoList(),
        };
    }
}
