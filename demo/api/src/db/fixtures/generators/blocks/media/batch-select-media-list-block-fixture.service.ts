import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import {
    BatchSelectMediaListBlock,
    BatchSelectMediaListImageListBlock,
    BatchSelectMediaListVideoListBlock,
} from "@src/documents/pages/blocks/batch-select-media-list.block";

import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";
import { DamVideoBlockFixtureService } from "./dam-video-block-fixture.service";

@Injectable()
export class BatchSelectMediaListBlockFixtureService {
    constructor(
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly damVideoBlockFixtureService: DamVideoBlockFixtureService,
    ) {}

    private async generateImageList(min = 1, max = 3): Promise<ExtractBlockInputFactoryProps<typeof BatchSelectMediaListImageListBlock>> {
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

    private async generateVideoList(min = 1, max = 2): Promise<ExtractBlockInputFactoryProps<typeof BatchSelectMediaListVideoListBlock>> {
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

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof BatchSelectMediaListBlock>> {
        return {
            images: await this.generateImageList(),
            videos: await this.generateVideoList(),
        };
    }
}
