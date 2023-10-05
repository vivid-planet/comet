import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { IsOptional, IsString } from "class-validator";

import { FooterLinkSectionBlock } from "./footer-link-section.block";

export const FooterTopLinksBlock = createListBlock({ block: FooterLinkSectionBlock }, "FooterTopLinks");

class FooterBlockData extends BlockData {
    @ChildBlock(LinkListBlock)
    popularTopicsLinks: BlockDataInterface;

    @ChildBlock(LinkListBlock)
    aboutLinks: BlockDataInterface;

    @ChildBlock(LinkListBlock)
    bottomLinks: BlockDataInterface;

    @BlockField()
    copyrightNotice?: string;

    @BlockField()
    location?: string;

    @BlockField()
    contactUs?: string;
}

class FooterBlockInput extends BlockInput {
    @ChildBlockInput(LinkListBlock)
    popularTopicsLinks: ExtractBlockInput<typeof LinkListBlock>;

    @ChildBlockInput(LinkListBlock)
    aboutLinks: ExtractBlockInput<typeof LinkListBlock>;

    @ChildBlockInput(LinkListBlock)
    bottomLinks: ExtractBlockInput<typeof LinkListBlock>;

    @BlockField()
    @IsOptional()
    @IsString()
    copyrightNotice?: string;

    @BlockField()
    @IsOptional()
    @IsString()
    location?: string;

    @BlockField()
    @IsOptional()
    @IsString()
    contactUs?: string;

    transformToBlockData(): FooterBlockData {
        return inputToData(FooterBlockData, this);
    }
}

export const FooterContentBlock = createBlock(FooterBlockData, FooterBlockInput, "FooterContent");
