import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { AccordionItemBlock } from "@src/common/blocks/accordion-item.block";

import { AccordionContentBlockFixtureService } from "./accordion-content-block-fixture.service";

@Injectable()
export class AccordionItemBlockFixtureService {
    constructor(private readonly accordionContentBlockFixtureService: AccordionContentBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof AccordionItemBlock>> {
        return {
            title: faker.lorem.words({ min: 3, max: 9 }),
            content: await this.accordionContentBlockFixtureService.generateBlockInput(),
            openByDefault: faker.datatype.boolean(),
        };
    }
}
