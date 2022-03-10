import { Type } from "class-transformer";
import { IsEnum, IsHash, IsInt, IsNumber, IsString, IsUUID, Max, Min, ValidateIf } from "class-validator";

import { FocalPoint } from "../../common/enums/focal-point.enum";
import { ImageCropArea } from "../entities/image-crop-area.entity";
import { IsAllowedImageSize } from "../validators/is-allowed-image-size.validator";
import { IsValidImageAspectRatio } from "../validators/is-valid-aspect-ratio.validator";

export class ImageParams {
    @IsUUID()
    fileId: string;

    @IsEnum(FocalPoint)
    focalPoint: FocalPoint;

    @Type(() => Number)
    @ValidateIf((ip) => ip.focalPoint !== FocalPoint.SMART)
    @IsNumber()
    @Min(0)
    @Max(100)
    cropWidth?: number;

    @Type(() => Number)
    @ValidateIf((ip) => ip.focalPoint !== FocalPoint.SMART)
    @IsNumber()
    @Min(0)
    @Max(100)
    cropHeight?: number;

    @Type(() => Number)
    @ValidateIf((ip) => ip.focalPoint !== FocalPoint.SMART)
    @IsNumber()
    @Min(0)
    @Max(100)
    cropX?: number;

    @Type(() => Number)
    @ValidateIf((ip) => ip.focalPoint !== FocalPoint.SMART)
    @IsNumber()
    @Min(0)
    @Max(100)
    cropY?: number;

    @Type(() => Number)
    @IsInt()
    @IsAllowedImageSize()
    resizeWidth: number;

    @Type(() => Number)
    @IsInt()
    @IsValidImageAspectRatio("resizeWidth")
    resizeHeight: number;

    @IsString()
    filename: string;

    get cropArea(): ImageCropArea {
        return {
            focalPoint: this.focalPoint,
            width: this.cropWidth,
            height: this.cropHeight,
            x: this.cropX,
            y: this.cropY,
        };
    }
}

export class HashImageParams extends ImageParams {
    @IsHash("sha1")
    hash: string;
}
