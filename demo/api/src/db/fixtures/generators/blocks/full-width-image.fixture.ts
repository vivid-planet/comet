import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { FullWidthImageBlock, FullWidthImageContentBlock } from "@src/pages/blocks/full-width-image.block";
import { datatype } from "faker";

import { DamImageBlockFixtureService } from "./dam-image.fixture";
import { RichTextBlockFixtureService } from "./richtext.fixture";

@Injectable()
export class FullWidthImageBlockFixtureService {
    constructor(
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof FullWidthImageBlock>> {
        return {
            image: await this.damImageBlockFixtureService.generateBlock(),
            content: FullWidthImageContentBlock.blockInputFactory({
                visible: datatype.boolean(),
                block: await this.richTextBlockFixtureService.generateBlock(),
            }),
        };
    }
}
