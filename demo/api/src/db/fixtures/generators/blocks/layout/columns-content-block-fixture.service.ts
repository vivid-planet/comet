import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { ColumnsContentBlock, supportedBlocks as ColumnsBlockSupportedBlocks } from "@src/documents/pages/blocks/columns.block";

import { BlockFixture } from "../block-fixture";
import { MediaGalleryBlockFixtureService } from "../media/media-gallery-block-fixture.service";
import { StandaloneMediaBlockFixtureService } from "../media/standalone-media-block-fixture.service";
import { StandaloneCallToActionListBlockFixtureService } from "../navigation/standalone-call-to-action-list-block-fixture.service";
import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";
import { StandaloneHeadingBlockFixtureService } from "../text-and-content/standalone-heading-block-fixture.service";
import { AccordionBlockFixtureService } from "./accordion-block-fixture.service";
import { SpaceBlockFixtureService } from "./space-block-fixture.service";

@Injectable()
export class ColumnsContentBlockFixtureService {
    constructor(
        private readonly accordionBlockFixtureService: AccordionBlockFixtureService,
        private readonly callToActionListBlockFixtureService: StandaloneCallToActionListBlockFixtureService,
        private readonly headingBlockFixtureService: StandaloneHeadingBlockFixtureService,
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly mediaGalleryBlockFixtureService: MediaGalleryBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly standaloneMediaBlockFixtureService: StandaloneMediaBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ColumnsContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof ColumnsContentBlock>["blocks"] = [];

        const blockCfg: Record<keyof typeof ColumnsBlockSupportedBlocks, BlockFixture> = {
            accordion: this.accordionBlockFixtureService,
            anchor: this.headingBlockFixtureService,
            callToActionList: this.callToActionListBlockFixtureService,
            heading: this.headingBlockFixtureService,
            media: this.standaloneMediaBlockFixtureService,
            mediaGallery: this.mediaGalleryBlockFixtureService,
            richtext: this.richtextBlockFixtureService,
            space: this.spaceBlockFixtureService,
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
            blocks: blocks,
        };
    }
}
