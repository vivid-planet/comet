import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { AccordionContentBlock, supportedBlocks } from "@src/common/blocks/accordion-item.block";

import { BlockFixture } from "../block-fixture";
import { StandaloneCallToActionListBlockFixtureService } from "../navigation/standalone-call-to-action-list-block-fixture.service";
import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";
import { StandaloneHeadingBlockFixtureService } from "../text-and-content/standalone-heading-block-fixture.service";
import { SpaceBlockFixtureService } from "./space-block-fixture.service";

@Injectable()
export class AccordionContentBlockFixtureService {
    constructor(
        private readonly callToActionListBlockFixtureService: StandaloneCallToActionListBlockFixtureService,
        private readonly headingBlockFixtureService: StandaloneHeadingBlockFixtureService,
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof AccordionContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof AccordionContentBlock>["blocks"] = [];

        const blockCfg: Record<keyof typeof supportedBlocks, BlockFixture> = {
            richtext: this.richTextBlockFixtureService,
            heading: this.headingBlockFixtureService,
            space: this.spaceBlockFixtureService,
            callToActionList: this.callToActionListBlockFixtureService,
        };

        for (const block of Object.entries(blockCfg)) {
            const [type, generator] = block;
            const props = await generator.generateBlockInput();

            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                type: type as keyof typeof blockCfg,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                props: props as any,
            });
        }

        return {
            blocks,
        };
    }
}
