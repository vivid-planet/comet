import { BlockDataInterface, BlockField, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsString, Matches } from "class-validator";

import { BaseVideoBlockData, BaseVideoBlockInput } from "./base-video-block";

class VimeoVideoBlockData extends BaseVideoBlockData {
    @BlockField({ nullable: true })
    vimeoIdentifier?: string;
}

class VimeoVideoBlockInput extends BaseVideoBlockInput {
    @IsOptional()
    @IsString()
    @Matches(/^(https?:\/\/)?((www\.|player\.)?vimeo\.com\/?(showcase\/)*([0-9a-z]*\/)*([0-9]{6,11})[?]?.*)$|^([0-9]{6,11})$/)
    @BlockField({ nullable: true })
    vimeoIdentifier?: string;

    transformToBlockData(): BlockDataInterface {
        return inputToData(VimeoVideoBlockData, this);
    }
}

export const VimeoVideoBlock = createBlock(VimeoVideoBlockData, VimeoVideoBlockInput, "VimeoVideo");
