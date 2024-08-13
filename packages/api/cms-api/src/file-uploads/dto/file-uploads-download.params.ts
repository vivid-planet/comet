import { Type } from "class-transformer";
import { IsHash, IsNumber, IsUUID } from "class-validator";

import { IsAllowedResizeWidth } from "../validators/is-allowed-resize-width.validator";

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

export class PreviewParams extends HashDownloadParams {
    @Type(() => Number)
    @IsAllowedResizeWidth()
    resizeWidth: number;
}
