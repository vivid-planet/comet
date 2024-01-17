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

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof VideoBlock>> {
        const types = ["damVideo", "youtubeVideo"] as const;
        const type = random.arrayElement(types);

        switch (type) {
            case "damVideo":
                return { attachedBlocks: [{ type, props: await this.damVideoBlockFixtureService.generateBlockInput() }], activeType: type };
                break;
            case "youtubeVideo":
                return { attachedBlocks: [{ type, props: await this.youtubeVideoBlockFixtureService.generateBlockInput() }], activeType: type };
                break;
        }
    }
}
