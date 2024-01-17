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

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof MediaBlock>> {
        const types = ["image", "video"] as const;
        const type = random.arrayElement(types);

        switch (type) {
            case "image":
                return { attachedBlocks: [{ type, props: await this.damImageBlockFixtureService.generateBlockInput() }], activeType: type };
            case "video":
                return { attachedBlocks: [{ type, props: await this.damVideoBlockFixtureService.generateBlockInput() }], activeType: type };
        }
    }
}
