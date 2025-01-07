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
<<<<<<< HEAD
} from "@comet/cms-api";
=======
    inputToData,
} from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
>>>>>>> main
import { LinkListBlock } from "@src/common/blocks/link-list.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { IsString } from "class-validator";

<<<<<<< HEAD
class FooterBlockData extends BlockData {
    @ChildBlock(LinkListBlock)
    popularTopicsLinks: BlockDataInterface;
=======
class FooterContentBlockData extends BlockData {
    @ChildBlock(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlock(DamImageBlock)
    image: BlockDataInterface;
>>>>>>> main

    @ChildBlock(LinkListBlock)
    linkList: BlockDataInterface;

    @BlockField()
    copyrightNotice: string;
}

class FooterContentBlockInput extends BlockInput {
    @ChildBlockInput(RichTextBlock)
    text: ExtractBlockInput<typeof RichTextBlock>;

    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    @ChildBlockInput(LinkListBlock)
    linkList: ExtractBlockInput<typeof LinkListBlock>;

    @BlockField()
    @IsString()
    copyrightNotice: string;

<<<<<<< HEAD
    @BlockField()
    @IsOptional()
    @IsString()
    location?: string;

    @BlockField()
    @IsOptional()
    @IsString()
    contactUs?: string;

    transformToBlockData(): FooterBlockData {
        return blockInputToData(FooterBlockData, this);
=======
    transformToBlockData(): FooterContentBlockData {
        return inputToData(FooterContentBlockData, this);
>>>>>>> main
    }
}

export const FooterContentBlock = createBlock(FooterContentBlockData, FooterContentBlockInput, {
    name: "FooterContent",
});
