import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { TwoListsBlock, TwoListsList } from "@src/pages/blocks/two-lists.block";
import { datatype } from "faker";

import { HeadlineBlockFixtureService } from "./headline-block-fixture.service";

@Injectable()
export class TwoListsBlockFixtureService {
    constructor(private readonly headlineBlockFixtureService: HeadlineBlockFixtureService) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof TwoListsBlock>> {
        return {
            // @ts-expect-error wrong typing, remove expect error after: https://github.com/vivid-planet/comet/pull/1496
            list1: await this.generateHeadlineListBlock(),
            // @ts-expect-error wrong typing, remove expect error after: https://github.com/vivid-planet/comet/pull/1496
            list2: await this.generateHeadlineListBlock(),
        };
    }

    private async generateHeadlineListBlock(min = 1, max = 5): Promise<ExtractBlockInputFactoryProps<typeof TwoListsList>> {
        const blockAmount = datatype.number({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({ key: datatype.uuid(), visible: datatype.boolean(), props: await this.headlineBlockFixtureService.generateBlock() });
        }

        return {
            blocks,
        };
    }
}
