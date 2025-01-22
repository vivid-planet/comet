import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { KeyFactsBlock } from "@src/documents/pages/blocks/key-facts.block";

import { KeyFactsItemBlockFixtureService } from "./key-facts-item-block-fixture.service";

@Injectable()
export class KeyFactsBlockFixtureService {
    constructor(private readonly keyFactsItemBlockFixtureService: KeyFactsItemBlockFixtureService) {}

    async generateBlockInput(min = 2, max = 6): Promise<ExtractBlockInputFactoryProps<typeof KeyFactsBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.keyFactsItemBlockFixtureService.generateBlockInput(),
            });
        }

        return {
            blocks: blocks,
        };
    }
}
