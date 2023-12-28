import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { VideoBlock } from "@src/pages/blocks/video.block";
import { random } from "faker";

import { DamVideoBlockFixtureService } from "./dam-video-block-fixture.service";
import { YouTubeVideoBlockFixtureService } from "./you-tube-video-block-fixture.service";

@Injectable()
export class VideoBlockFixtureService {
    constructor(
        private readonly youtubeVideoBlockFixtureService: YouTubeVideoBlockFixtureService,
        private readonly damVideoBlockFixtureService: DamVideoBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof VideoBlock>> {
        return VideoBlock.blockInputFactory({
            attachedBlocks: [
                {
                    type: "damVideo",
                    props: await this.damVideoBlockFixtureService.generateBlock(),
                },
                {
                    type: "youtubeVideo",
                    props: await this.youtubeVideoBlockFixtureService.generateBlock(),
                },
            ],
            activeType: random.arrayElement(["damVideo", "youtubeVideo"]),
        });
    }
}
