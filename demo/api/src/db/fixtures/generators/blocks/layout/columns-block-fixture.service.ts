import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { ColumnsBlock, ColumnsContentBlock } from "@src/documents/pages/blocks/columns.block";

import { MediaGalleryBlockFixtureService } from "../media/media-gallery-block-fixture.service";
import { StandaloneMediaBlockFixtureService } from "../media/standalone-media-block-fixture.service";
import { StandaloneCallToActionListBlockFixtureService } from "../navigation/standalone-call-to-action-list-block-fixture.service";
import { RichTextBlockFixtureService } from "../text-and-content/rich-text-block-fixture.service";
import { StandaloneHeadingBlockFixtureService } from "../text-and-content/standalone-heading-block-fixture.service";
import { AccordionBlockFixtureService } from "./accordion-block-fixture.service";
import { SpaceBlockFixtureService } from "./space-block-fixture.service";

const twoColumnLayouts = [{ name: "9-9" }];
const threeColumnLayouts = [{ name: "5-5-5" }, { name: "6-6-6" }];
const fourColumnLayouts = [{ name: "5-5-5-5" }];

@Injectable()
export class ColumnsBlockFixtureService {
    constructor(
        private readonly accordionBlockFixtureService: AccordionBlockFixtureService,
        private readonly callToActionListBlockFixtureService: StandaloneCallToActionListBlockFixtureService,
        private readonly headingBlockFixtureService: StandaloneHeadingBlockFixtureService,
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly mediaGalleryBlockFixtureService: MediaGalleryBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly standaloneMediaBlockFixtureService: StandaloneMediaBlockFixtureService,
    ) {}

    async generateColumnsContentBlock(): Promise<ExtractBlockInputFactoryProps<typeof ColumnsContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof ColumnsContentBlock>["blocks"] = [];

        const blockCfg = {
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

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof ColumnsBlock>[]> {
        const content = await this.generateColumnsContentBlock();

        return [
            {
                layout: faker.helpers.arrayElement(twoColumnLayouts).name,
                columns: [
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                ],
            },
            {
                layout: faker.helpers.arrayElement(threeColumnLayouts).name,
                columns: [
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                ],
            },
            {
                layout: faker.helpers.arrayElement(fourColumnLayouts).name,
                columns: [
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                    {
                        key: faker.string.uuid(),
                        visible: true,
                        props: content,
                    },
                ],
            },
        ];
    }
}
