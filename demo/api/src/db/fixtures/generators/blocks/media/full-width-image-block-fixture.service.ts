import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { FullWidthImageBlock } from "@src/documents/pages/blocks/full-width-image.block";

import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";
import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";

@Injectable()
export class FullWidthImageBlockFixtureService {
    constructor(
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof FullWidthImageBlock>> {
        return {
            content: {
                ...(await this.richTextBlockFixtureService.generateBlockInput()),
                visible: faker.datatype.boolean({ probability: 1.0 }),
            },
            image: await this.damImageBlockFixtureService.generateBlockInput(),
        };
    }
}
