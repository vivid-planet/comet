import { ExtractBlockInput, ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";

import { AccordionBlockFixtureService } from "./blocks/layout/accordion-block-fixture.service";
import { ColumnsBlockFixtureService } from "./blocks/layout/columns-block-fixture.service";
import { ContentGroupBlockFixtureService } from "./blocks/layout/content-group-block-fixture.service";
import { LayoutBlockFixtureService } from "./blocks/layout/layout-block-fixture.service";
import { SpaceBlockFixtureService } from "./blocks/layout/space-block-fixture.service";
import { DamImageBlockFixtureService } from "./blocks/media/dam-image-block-fixture.service";
import { FullWidthImageBlockFixtureService } from "./blocks/media/full-width-image-block-fixture.service";
import { MediaGalleryBlockFixtureService } from "./blocks/media/media-gallery-block-fixture.service";
import { StandaloneMediaBlockFixtureService } from "./blocks/media/standalone-media-block-fixture.service";
import { AnchorBlockFixtureService } from "./blocks/navigation/anchor-block-fixture.service";
import { LinkListBlockFixtureService } from "./blocks/navigation/link-list-block-fixture.service";
import { StandaloneCallToActionListBlockFixtureService } from "./blocks/navigation/standalone-call-to-action-list-block-fixture.service";
import { BillboardTeaserBlockFixtureService } from "./blocks/teaser/billboard-teaser-block-fixture.service";
import { TeaserBlockFixtureService } from "./blocks/teaser/teaser-block-fixture.service";
import { KeyFactsBlockFixtureService } from "./blocks/text-and-content/key-facts-block-fixture.service";
import { RichTextBlockFixtureService } from "./blocks/text-and-content/rich-text-block-fixture.service";
import { StandaloneHeadingBlockFixtureService } from "./blocks/text-and-content/standalone-heading-block-fixture.service";
import { TextImageBlockFixtureService } from "./blocks/text-and-content/text-image-block-fixture.service";

export type BlockCategory = "layout" | "media" | "navigation" | "teaser" | "textAndContent";

@Injectable()
export class PageContentBlockFixtureService {
    constructor(
        private readonly accordionBlockFixtureService: AccordionBlockFixtureService,
        private readonly anchorBlockFixtureService: AnchorBlockFixtureService,
        private readonly billboardTeaserBlockFixtureService: BillboardTeaserBlockFixtureService,
        private readonly callToActionListBlockFixtureService: StandaloneCallToActionListBlockFixtureService,
        private readonly columnsBlockFixtureService: ColumnsBlockFixtureService,
        private readonly contentGroupBlockFixtureService: ContentGroupBlockFixtureService,
        private readonly fullWidthImageBlockFixtureService: FullWidthImageBlockFixtureService,
        private readonly headingBlockFixtureService: StandaloneHeadingBlockFixtureService,
        private readonly imageBlockFixtureService: DamImageBlockFixtureService,
        private readonly keyFactsBlockFixtureService: KeyFactsBlockFixtureService,
        private readonly layoutBlockFixtureService: LayoutBlockFixtureService,
        private readonly linkListBlockFixtureService: LinkListBlockFixtureService,
        private readonly mediaGalleryBlockFixtureService: MediaGalleryBlockFixtureService,
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly mediaBlockFixtureService: StandaloneMediaBlockFixtureService,
        private readonly teaserBlockFixtureService: TeaserBlockFixtureService,
        private readonly textImageBlockFixtureService: TextImageBlockFixtureService,
    ) {}

    async generateBlockInput(blockCategory?: BlockCategory): Promise<ExtractBlockInput<typeof PageContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof PageContentBlock>["blocks"] = [];

        const fixturesLayout = {
            accordion: this.accordionBlockFixtureService,
            columns: this.columnsBlockFixtureService,
            contentGroup: this.contentGroupBlockFixtureService,
            layout: this.layoutBlockFixtureService,
            space: this.spaceBlockFixtureService,
        };

        const fixturesMedia = {
            fullWidthImage: this.fullWidthImageBlockFixtureService,
            image: this.imageBlockFixtureService,
            media: this.mediaBlockFixtureService,
            mediaGallery: this.mediaGalleryBlockFixtureService,
        };

        const fixturesNavigation = {
            anchor: this.anchorBlockFixtureService,
            callToActionList: this.callToActionListBlockFixtureService,
            linkList: this.linkListBlockFixtureService,
        };

        const fixturesTeaser = {
            billboardTeaserBlock: this.billboardTeaserBlockFixtureService,
            teaser: this.teaserBlockFixtureService,
        };

        const fixturesTextAndContent = {
            heading: this.headingBlockFixtureService,
            keyFacts: this.keyFactsBlockFixtureService,
            richtext: this.richtextBlockFixtureService,
            textImage: this.textImageBlockFixtureService,
        };

        const supportedBlocksFixtureGenerators = {
            ...(!blockCategory || blockCategory === "layout" ? fixturesLayout : {}),
            ...(!blockCategory || blockCategory === "media" ? fixturesMedia : {}),
            ...(!blockCategory || blockCategory === "navigation" ? fixturesNavigation : {}),
            ...(!blockCategory || blockCategory === "teaser" ? fixturesTeaser : {}),
            ...(!blockCategory || blockCategory === "textAndContent" ? fixturesTextAndContent : {}),
        };

        for (const block of Object.entries(supportedBlocksFixtureGenerators)) {
            const [type, generator] = block;

            if (generator) {
                const props = await generator.generateBlockInput();

                if (type === "columns") {
                    const columnBlocks = await this.columnsBlockFixtureService.generateBlockInput();
                    // in case of columns one random block with 2 columns and one random block with 3 columns is created
                    blocks.push(
                        ...columnBlocks.map((props) => ({
                            key: faker.string.uuid(),
                            visible: true,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            type: "columns" as any,
                            props,
                        })),
                    );
                } else {
                    blocks.push({
                        key: faker.string.uuid(),
                        visible: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        type: type as any,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        props: props as any,
                    });
                }
            }
        }

        return PageContentBlock.blockInputFactory({ blocks });
    }
}
