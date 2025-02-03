import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { DamVideoBlock } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { VideoFixtureService } from "../../video-fixture.service";
import { SvgImageBlockFixtureService } from "./svg-image-block-fixture.service";

@Injectable()
export class DamVideoBlockFixtureService {
    constructor(
        private readonly videoFixtureService: VideoFixtureService,
        private readonly svgImageBlockFixtureService: SvgImageBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof DamVideoBlock>> {
        const autoplay = faker.datatype.boolean();
        const damFileId = this.videoFixtureService.getRandomVideo().id;

        return {
            autoplay,
            loop: faker.datatype.boolean(),
            showControls: !autoplay,
            damFileId,
            previewImage: await this.svgImageBlockFixtureService.generateBlockInput(),
        };
    }
}
