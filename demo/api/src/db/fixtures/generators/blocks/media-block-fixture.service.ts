import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { Injectable } from "@nestjs/common";
import { MediaBlock } from "@src/pages/blocks/media.block";
import { random } from "faker";

import { DamImageBlockFixtureService } from "./dam-image-block-fixture.service";
import { DamVideoBlockFixtureService } from "./dam-video-block-fixture.service";

@Injectable()
export class MediaBlockFixtureService {
    constructor(
        private readonly damImageBlockFixtureService: DamImageBlockFixtureService,
        private readonly damVideoBlockFixtureService: DamVideoBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof MediaBlock>> {
        return MediaBlock.blockInputFactory({
            attachedBlocks: [
                {
                    type: "image",
                    props: await this.damImageBlockFixtureService.generateBlock(),
                },
                {
                    type: "video",
                    props: await this.damVideoBlockFixtureService.generateBlock(),
                },
            ],
            activeType: random.arrayElement(["image", "video"]),
        });
    }
}
