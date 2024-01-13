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
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { IsOptional, IsString, ValidateNested } from "class-validator";

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
