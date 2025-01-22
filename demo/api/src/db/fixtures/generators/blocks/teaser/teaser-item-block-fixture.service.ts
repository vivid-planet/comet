import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { TeaserItemBlock } from "@src/documents/pages/blocks/teaser-item.block";

import { MediaTypeBlockFixtureService } from "../media/media-type-block.fixture.service";
import { TextLinkBlockFixtureService } from "../navigation/text-link-block-fixture.service";
import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";

@Injectable()
export class TeaserItemBlockFixtureService {
    constructor(
        private readonly mediaTypeBlockFixtureService: MediaTypeBlockFixtureService,
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
        private readonly textLinkBlockFixtureService: TextLinkBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof TeaserItemBlock>> {
        return {
            media: await this.mediaTypeBlockFixtureService.generateBlockInput(),
            title: faker.lorem.words({ min: 3, max: 9 }),
            description: await this.richTextBlockFixtureService.generateBlockInput(),
            link: await this.textLinkBlockFixtureService.generateBlockInput(),
        };
    }
}
