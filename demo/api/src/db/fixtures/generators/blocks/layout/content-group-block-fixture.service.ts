import { ExtractBlockInputFactoryProps } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { BackgroundColor as ContentGroupBackgroundColor, ContentBlock, ContentGroupBlock } from "@src/documents/pages/blocks/content-group.block";

import { BlockFixture } from "../block-fixture";
import { MediaGalleryBlockFixtureService } from "../media/media-gallery-block-fixture.service";
import { StandaloneMediaBlockFixtureService } from "../media/standalone-media-block-fixture.service";
import { AnchorBlockFixtureService } from "../navigation/anchor-block-fixture.service";
import { StandaloneCallToActionListBlockFixtureService } from "../navigation/standalone-call-to-action-list-block-fixture.service";
import { TeaserBlockFixtureService } from "../teaser/teaser-block-fixture.service";
import { KeyFactsBlockFixtureService } from "../text-and-content/key-facts-block-fixture.service";
import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";
import { StandaloneHeadingBlockFixtureService } from "../text-and-content/standalone-heading-block-fixture.service";
import { AccordionBlockFixtureService } from "./accordion-block-fixture.service";
import { ColumnsBlockFixtureService } from "./columns-block-fixture.service";
import { SpaceBlockFixtureService } from "./space-block-fixture.service";

@Injectable()
export class ContentGroupBlockFixtureService {
    constructor(
        private readonly accordionBlockFixtureService: AccordionBlockFixtureService,
        private readonly anchorBlockFixtureService: AnchorBlockFixtureService,
        private readonly columnsBlockFixtureService: ColumnsBlockFixtureService,
        private readonly keyFactsBlockFixtureService: KeyFactsBlockFixtureService,
        private readonly mediaGalleryBlockFixtureService: MediaGalleryBlockFixtureService,
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly standaloneMediaBlockFixtureService: StandaloneMediaBlockFixtureService,
        private readonly standaloneHeadingBlockFixtureService: StandaloneHeadingBlockFixtureService,
        private readonly standaloneCallToActionListBlockFixtureService: StandaloneCallToActionListBlockFixtureService,
        private readonly teaserBlockFixtureService: TeaserBlockFixtureService,
    ) {}

    async generateContentGroupContentBlock(): Promise<ExtractBlockInputFactoryProps<typeof ContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof ContentBlock>["blocks"] = [];

        const blockCfg: Record<(typeof blocks)[number]["type"], BlockFixture> = {
            accordion: this.accordionBlockFixtureService,
            anchor: this.anchorBlockFixtureService,
            callToActionList: this.standaloneCallToActionListBlockFixtureService,
            columns: this.columnsBlockFixtureService,
            heading: this.standaloneHeadingBlockFixtureService,
            keyFacts: this.keyFactsBlockFixtureService,
            media: this.standaloneMediaBlockFixtureService,
            mediaGallery: this.mediaGalleryBlockFixtureService,
            richtext: this.richTextBlockFixtureService,
            space: this.spaceBlockFixtureService,
            teaser: this.teaserBlockFixtureService,
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

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ContentGroupBlock>> {
        return {
            backgroundColor: faker.helpers.arrayElement(Object.values(ContentGroupBackgroundColor)),
            content: await this.generateContentGroupContentBlock(),
        };
    }
}
