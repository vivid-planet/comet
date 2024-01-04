import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { DamVideoBlock } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { datatype } from "faker";

import { VideoFixtureService } from "../video-fixture.service";

@Injectable()
export class DamVideoBlockFixtureService {
    constructor(private readonly videoFixtureService: VideoFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof DamVideoBlock>> {
        const autoplay = datatype.boolean();
        const damFileId = this.videoFixtureService.getRandomVideo().id;

        return {
            autoplay,
            loop: datatype.boolean(),
            showControls: !autoplay,
            damFileId,
        };
    }
}
