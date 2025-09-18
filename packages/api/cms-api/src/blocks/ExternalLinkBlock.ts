import { IsBoolean, IsOptional } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock } from "./block.js";
import { BlockField } from "./decorators/field.js";
import { IsLinkTarget } from "./validator/is-link-target.validator.js";

class ExternalLinkBlockData extends BlockData {
    @BlockField({ nullable: true })
    targetUrl?: string;

    @BlockField()
    openInNewWindow: boolean;
}

class ExternalLinkBlockInput extends BlockInput {
    @IsOptional()
    @IsLinkTarget()
    @BlockField({ nullable: true })
    targetUrl?: string;

    @IsBoolean()
    @BlockField()
    openInNewWindow: boolean;

    transformToBlockData(): ExternalLinkBlockData {
        return blockInputToData(ExternalLinkBlockData, this);
    }
}

export const ExternalLinkBlock = createBlock(ExternalLinkBlockData, ExternalLinkBlockInput, "ExternalLink");
