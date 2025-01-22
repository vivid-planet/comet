import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { KeyFactsItemBlock } from "@src/documents/pages/blocks/key-facts-item.block";

import { SvgImageBlockFixtureService } from "../media/svg-image-block-fixture.service";
import { RichTextBlockFixtureService } from "./rich-text-block-fixture.service";

@Injectable()
export class KeyFactsItemBlockFixtureService {
    constructor(
        private readonly svgImageBlockFixtureService: SvgImageBlockFixtureService,
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof KeyFactsItemBlock>> {
        return {
            icon: await this.svgImageBlockFixtureService.generateBlockInput(),
            fact: faker.lorem.sentence(),
            label: faker.lorem.sentence(),
            description: await this.richTextBlockFixtureService.generateBlockInput(),
        };
    }
}
