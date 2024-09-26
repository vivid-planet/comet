import { Type } from "class-transformer";
import { IsHash, IsInt, IsNumber, IsUUID } from "class-validator";

export class DownloadParams {
    @IsUUID()
    id: string;

    @Type(() => Number)
    @IsNumber()
    timeout: number;
}

export class HashDownloadParams extends DownloadParams {
    @IsHash("sha1")
    hash: string;
}

export class ImageParams extends DownloadParams {
    @Type(() => Number)
    @IsInt()
    resizeWidth: number;
}

export class HashImageParams extends ImageParams {
    @IsHash("sha1")
    hash: string;
}
