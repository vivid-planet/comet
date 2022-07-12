import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { IsOptional, IsString, ValidateNested } from "class-validator";

import { LinkListBlock } from "../../common/blocks/link-list.block";

class FooterLinkSectionBlockData extends BlockData {
    @BlockField()
    title?: string;

    @ChildBlock(LinkListBlock)
    links: BlockDataInterface;
}

class FooterLinkSectionBlockInput extends BlockInput {
    @BlockField()
    @IsOptional()
    @IsString()
    title?: string;

    @ChildBlockInput(LinkListBlock)
    @ValidateNested()
    links: ExtractBlockInput<typeof LinkListBlock>;

    transformToBlockData(): FooterLinkSectionBlockData {
        return inputToData(FooterLinkSectionBlockData, this);
    }
}

export const FooterLinkSectionBlock = createBlock(FooterLinkSectionBlockData, FooterLinkSectionBlockInput, "FooterLinkSection");
