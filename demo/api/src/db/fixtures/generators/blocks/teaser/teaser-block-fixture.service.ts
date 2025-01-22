import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { TeaserBlock } from "@src/documents/pages/blocks/teaser.block";

import { TeaserItemBlockFixtureService } from "./teaser-item-block-fixture.service";

@Injectable()
export class TeaserBlockFixtureService {
    constructor(private readonly teaserItemBlockFixtureService: TeaserItemBlockFixtureService) {}

    async generateBlockInput(min = 2, max = 6): Promise<ExtractBlockInputFactoryProps<typeof TeaserBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.teaserItemBlockFixtureService.generateBlockInput(),
            });
        }

        return {
            blocks: blocks,
        };
    }
}
