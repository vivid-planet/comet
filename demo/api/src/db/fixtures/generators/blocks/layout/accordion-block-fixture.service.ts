import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { AccordionBlock } from "@src/common/blocks/accordion.block";

import { AccordionItemBlockFixtureService } from "./accordion-item-block-fixture.service";

@Injectable()
export class AccordionBlockFixtureService {
    constructor(private readonly accordionItemBlockFixtureService: AccordionItemBlockFixtureService) {}

    async generateBlockInput(min = 2, max = 6): Promise<ExtractBlockInputFactoryProps<typeof AccordionBlock>> {
        const blockAmount = faker.number.int({ min, max });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: await this.accordionItemBlockFixtureService.generateBlockInput(),
            });
        }

        return {
            blocks: blocks,
        };
    }
}
