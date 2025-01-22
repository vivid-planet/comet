import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { LayoutBlock, LayoutBlockLayout } from "@src/documents/pages/blocks/layout.block";

import { MediaTypeBlockFixtureService } from "../media/media-type-block.fixture.service";
import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";

@Injectable()
export class LayoutBlockFixtureService {
    constructor(
        private readonly mediaTypeBlockFixtureService: MediaTypeBlockFixtureService,
        private readonly richTextFixtureService: RichTextBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof LayoutBlock>> {
        return {
            layout: faker.helpers.arrayElement(Object.values(LayoutBlockLayout)),
            media1: await this.mediaTypeBlockFixtureService.generateBlockInput(),
            text1: await this.richTextFixtureService.generateBlockInput(),
            media2: await this.mediaTypeBlockFixtureService.generateBlockInput(),
            text2: await this.richTextFixtureService.generateBlockInput(),
        };
    }
}
