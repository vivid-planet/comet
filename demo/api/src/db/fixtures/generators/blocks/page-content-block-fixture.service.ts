import { Block, ExtractBlockInput, ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { PageContentBlock, supportedBlocks } from "@src/pages/blocks/page-content.block";
import { UserGroup } from "@src/user-groups/user-group";
import { datatype, random } from "faker";

import { AnchorBlockFixtureService } from "./anchor-block-fixture.service";
import { ColumnsBlockFixtureService } from "./columns-block-fixture.service";
import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";
import { DamVideoBlockFixtureService } from "./dam-video-block-fixture.service";
import { FullWidthImageBlockFixtureService } from "./full-width-image-block-fixture.service";
import { HeadlineBlockFixtureService } from "./headline-block-fixture.service";
import { LinkListBlockFixtureService } from "./link-list-block-fixture.service";
import { MediaBlockFixtureService } from "./media-block-fixture.service";
import { RichTextBlockFixtureService } from "./richtext-block-fixture.service";
import { SpaceBlockFixtureService } from "./space-block-fixture.service";
import { TextImageBlockFixtureService } from "./text-image-block-fixture.service";
import { TwoListsBlockFixtureService } from "./two-lists-block-fixture.service";
import { VideoBlockFixtureService } from "./video-block-fixture.service";
import { YouTubeVideoBlockFixtureService } from "./you-tube-video-block-fixture.service";

export type BlockFixture = { generateBlockInput: () => Promise<ExtractBlockInputFactoryProps<Block>> };

@Injectable()
export class PageContentBlockFixtureService {
    constructor(
        private readonly richtextBlockFixtureService: RichTextBlockFixtureService,
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly textImageBlockFixtureService: TextImageBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly headlineBlockFixtureService: HeadlineBlockFixtureService,
        private readonly anchorBlockFixtureService: AnchorBlockFixtureService,
        private readonly fullWithBlockFixtureService: FullWidthImageBlockFixtureService,
        private readonly linkListBlockFixtureService: LinkListBlockFixtureService,
        private readonly youTubeVideoBlockFixtureService: YouTubeVideoBlockFixtureService,
        private readonly damVideoBlockFixtureService: DamVideoBlockFixtureService,
        private readonly columnsBlockFixtureService: ColumnsBlockFixtureService,
        private readonly mediaBlockFixtureService: MediaBlockFixtureService,
        private readonly videoBlockFixtureService: VideoBlockFixtureService,
        private readonly twoListsBlockFixtureService: TwoListsBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInput<typeof PageContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof PageContentBlock>["blocks"] = [];

        const supportedBlocksFixtureGenerators: Record<keyof typeof supportedBlocks, BlockFixture> = {
            richtext: this.richtextBlockFixtureService,
            image: this.damImageBlockFixtureService,
            textImage: this.textImageBlockFixtureService,
            space: this.spaceBlockFixtureService,
            linkList: this.linkListBlockFixtureService,
            fullWidthImage: this.fullWithBlockFixtureService,
            anchor: this.anchorBlockFixtureService,
            columns: this.columnsBlockFixtureService,
            damVideo: this.damVideoBlockFixtureService,
            headline: this.headlineBlockFixtureService,
            youTubeVideo: this.youTubeVideoBlockFixtureService,
            media: this.mediaBlockFixtureService,
            video: this.videoBlockFixtureService,
            twoLists: this.twoListsBlockFixtureService,
        };

        for (let i = 0; i < 10; i++) {
            const [type, generator] = random.arrayElement(Object.entries(supportedBlocksFixtureGenerators));
            if (generator) {
                const props = await generator.generateBlockInput();
                const userGroup = random.arrayElement(Object.values(UserGroup));
                blocks.push({
                    key: String(i),
                    visible: datatype.boolean(),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type: type as any,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props: props as any,
                    // @ts-expect-error wrong typing?
                    userGroup,
                });
            }
        }

        return PageContentBlock.blockInputFactory({ blocks });
    }
}
