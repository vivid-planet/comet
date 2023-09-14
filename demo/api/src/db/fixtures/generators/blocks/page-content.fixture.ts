import { Block, ExtractBlockInput, ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { PageContentBlock, supportedBlocks } from "@src/pages/blocks/page-content.block";
import { UserGroup } from "@src/user-groups/user-group";
import { datatype, random } from "faker";

import { AnchorBlockFixtureService } from "./anchor.fixture";
import { ColumnsBlockFixtureService } from "./columns.fixture";
import { DamImageBlockFixtureService } from "./dam-image.fixture";
import { DamVideoBlockFixtureService } from "./dam-video.fixture";
import { FullWidthImageBlockFixtureService } from "./full-width-image.fixture";
import { HeadlineBlockFixtureService } from "./headline.fixture";
import { LinkListBlockFixtureService } from "./link-list.fixture";
import { MediaBlockFixtureService } from "./media.fixture";
import { RichTextBlockFixtureService } from "./richtext.fixture";
import { SpaceBlockFixtureService } from "./space.fixture";
import { TextImageBlockFixtureService } from "./text-image.fixture";
import { TwoListsBlockFixtureService } from "./two-lists.fixture";
import { VideoBlockFixtureService } from "./video.fixture";
import { YouTubeVideoBlockFixtureService } from "./you-tube-video.fixture";

export type BlockFixture = { generateBlock: () => Promise<ExtractBlockInputFactoryProps<Block>> };

@Injectable()
export class PageContentBlockFixtureService {
    constructor(
        private readonly richtextGeneratorService: RichTextBlockFixtureService,
        private readonly damImageBlockGenerator: DamImageBlockFixtureService,
        private readonly textImageBlockGenerator: TextImageBlockFixtureService,
        private readonly spaceBlockGenerator: SpaceBlockFixtureService,
        private readonly headlineBlockGenerator: HeadlineBlockFixtureService,
        private readonly anchorBlockGenerator: AnchorBlockFixtureService,
        private readonly fullWithBlockGenerator: FullWidthImageBlockFixtureService,
        private readonly linkListBlockGenerator: LinkListBlockFixtureService,
        private readonly youTubeVideoBlockGenerator: YouTubeVideoBlockFixtureService,
        private readonly damVideoBlockGenerator: DamVideoBlockFixtureService,
        private readonly columnsBlockGenerator: ColumnsBlockFixtureService,
        private readonly mediaBlockGenerator: MediaBlockFixtureService,
        private readonly videoBlockGenerator: VideoBlockFixtureService,
        private readonly twoListsBlockGenerator: TwoListsBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInput<typeof PageContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof PageContentBlock>["blocks"] = [];

        const blockCfg: Record<keyof typeof supportedBlocks, BlockFixture> = {
            richtext: this.richtextGeneratorService,
            image: this.damImageBlockGenerator,
            textImage: this.textImageBlockGenerator,
            space: this.spaceBlockGenerator,
            linkList: this.linkListBlockGenerator,
            fullWidthImage: this.fullWithBlockGenerator,
            anchor: this.anchorBlockGenerator,
            columns: this.columnsBlockGenerator,
            damVideo: this.damVideoBlockGenerator,
            headline: this.headlineBlockGenerator,
            youTubeVideo: this.youTubeVideoBlockGenerator,
            media: this.mediaBlockGenerator,
            video: this.videoBlockGenerator,
            twoLists: this.twoListsBlockGenerator,
        };

        for (let i = 0; i < 10; i++) {
            const [type, generator] = random.arrayElement(Object.entries(blockCfg));
            if (generator) {
                const props = await generator.generateBlock();
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
