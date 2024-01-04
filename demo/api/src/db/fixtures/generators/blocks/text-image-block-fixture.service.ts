import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { ImagePosition } from "@comet/cms-api/lib/blocks/createTextImageBlock";
import { Inject, Injectable } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { TextImageBlock } from "@src/pages/blocks/TextImageBlock";
import faker from "faker";

import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";
import { RichTextBlockFixtureService } from "./richtext-block-fixture.service";

@Injectable()
export class TextImageBlockFixtureService {
    constructor(
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        @Inject(CONFIG) private readonly config: Config,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof TextImageBlock>> {
        return {
            text: await this.richtextBlockFixtureService.generateBlockInput(),
            image: await this.damImageBlockFixtureService.generateBlockInput(),
            imagePosition: faker.random.arrayElement([ImagePosition.Left, ImagePosition.Right]),
            imageAspectRatio: faker.random.arrayElement(this.config.dam.allowedImageAspectRatios),
        };
    }
}
