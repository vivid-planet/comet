import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { StandaloneHeadingBlock, TextAlignment } from "@src/common/blocks/standalone-heading.block";

import { HeadingBlockFixtureService } from "./heading-block-fixture.service";

@Injectable()
export class StandaloneHeadingBlockFixtureService {
    constructor(private readonly headingBlockFixtureService: HeadingBlockFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof StandaloneHeadingBlock>> {
        return {
            heading: await this.headingBlockFixtureService.generateBlockInput(),
            textAlignment: faker.helpers.arrayElement(Object.values(TextAlignment)),
        };
    }
}
