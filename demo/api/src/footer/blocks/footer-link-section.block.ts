import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
} from "@comet/cms-api";
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
        return blockInputToData(FooterLinkSectionBlockData, this);
    }
}

export const FooterLinkSectionBlock = createBlock(FooterLinkSectionBlockData, FooterLinkSectionBlockInput, "FooterLinkSection");
