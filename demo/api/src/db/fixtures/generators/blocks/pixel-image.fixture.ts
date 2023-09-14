import { ExtractBlockInputFactoryProps } from "@comet/blocks-api";
import { FocalPoint, ImageCropAreaInput, PixelImageBlock } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { datatype, random } from "faker";

import { ImageFixtureService } from "../image-fixture.service";

@Injectable()
export class PixelImageBlockFixtureService {
    constructor(private readonly imageFixtureService: ImageFixtureService) {}

    async generateBlock(): Promise<ExtractBlockInputFactoryProps<typeof PixelImageBlock>> {
        return {
            damFileId: this.imageFixtureService.getRandomPixelImage().id,
            cropArea: calculateDefaultCropInput(),
        };
    }
}

export const calculateDefaultCropInput = (): ImageCropAreaInput => {
    const focalPoint = random.arrayElement(Object.values(Object.keys(FocalPoint))) as FocalPoint;

    return {
        focalPoint,
        x: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        y: focalPoint !== FocalPoint.SMART ? 0 : undefined,
        height: focalPoint !== FocalPoint.SMART ? datatype.number({ min: 20, max: 100 }) : undefined,
        width: focalPoint !== FocalPoint.SMART ? datatype.number({ min: 20, max: 100 }) : undefined,
    };
};
