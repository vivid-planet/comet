import { IsBoolean, IsOptional } from "class-validator";

import { BlockData, BlockInput, createBlock, inputToData } from "./block";
import { BlockField } from "./decorators/field";
import { IsLinkTarget } from "./externalLinkBlock/is-link-target.validator";

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
        return inputToData(ExternalLinkBlockData, this);
    }
}

export const ExternalLinkBlock = createBlock(ExternalLinkBlockData, ExternalLinkBlockInput, "ExternalLink");
export type { ExternalLinkBlockData, ExternalLinkBlockInput };
