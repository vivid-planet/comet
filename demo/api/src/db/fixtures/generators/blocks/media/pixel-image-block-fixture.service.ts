import { ExtractBlockInputFactoryProps, FocalPoint, ImageCropAreaInput, PixelImageBlock } from "@comet/cms-api";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { ImageFixtureService } from "../../image-fixture.service";

@Injectable()
export class PixelImageBlockFixtureService {
    constructor(private readonly imageFixtureService: ImageFixtureService) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof PixelImageBlock>> {
        return {
            damFileId: this.imageFixtureService.getRandomPixelImage().id,
            cropArea: this.calculateDefaultCropInput(),
        };
    }

    private calculateDefaultCropInput(): ImageCropAreaInput {
        const focalPoint = faker.helpers.arrayElement(Object.values(Object.keys(FocalPoint))) as FocalPoint;

        return {
            focalPoint,
            x: focalPoint !== FocalPoint.SMART ? 0 : undefined,
            y: focalPoint !== FocalPoint.SMART ? 0 : undefined,
            height: focalPoint !== FocalPoint.SMART ? faker.number.int({ min: 20, max: 100 }) : undefined,
            width: focalPoint !== FocalPoint.SMART ? faker.number.int({ min: 20, max: 100 }) : undefined,
        };
    }
}
