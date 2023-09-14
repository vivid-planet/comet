import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { DamImageBlock, FocalPoint, ImageCropAreaInput } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { datatype, random } from "faker";

import { PixelImageBlockFixtureService } from "./pixel-image.fixture";
import { SvgImageBlockFixtureService } from "./svg-image.fixture";

@Injectable()
export class DamImageBlockFixtureService {
    constructor(
        private readonly svgImageBlockFixture: SvgImageBlockFixtureService,
        private readonly pixelImageBlockFixture: PixelImageBlockFixtureService,
    ) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof DamImageBlock>> {
        let type: "svgImage" | "pixelImage" = "pixelImage";
        let props = await this.pixelImageBlockFixture.generateBlock();

        if (datatype.boolean()) {
            type = "svgImage";
            props = await this.svgImageBlockFixture.generateBlock();
        }

        return {
            attachedBlocks: [
                {
                    type,
                    props,
                },
            ],
            activeType: type,
        };
    }
}

export const calculateDefaultCropInput = (): ImageCropAreaInput => {
    const focalPoint = random.arrayElement([
        FocalPoint.SMART,
        FocalPoint.CENTER,
        FocalPoint.NORTHEAST,
        FocalPoint.NORTHWEST,
        FocalPoint.SOUTHEAST,
        FocalPoint.SOUTHWEST,
    ]);

    return {
        focalPoint,
        x: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        y: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        height: focalPoint !== FocalPoint.SMART ? datatype.number({ min: 20, max: 100 }) : undefined,
        width: focalPoint !== FocalPoint.SMART ? datatype.number({ min: 20, max: 100 }) : undefined,
    };
};
