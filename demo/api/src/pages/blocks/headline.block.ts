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
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum HeadlineLevel {
    HeaderOne = "header-one",
    HeaderTwo = "header-two",
    HeaderThree = "header-three",
    HeaderFour = "header-four",
    HeaderFive = "header-five",
    HeaderSix = "header-six",
}
/* eslint-enable @typescript-eslint/naming-convention */

class HeadlineBlockData extends BlockData {
    @BlockField({ nullable: true })
    eyebrow?: string;

    @ChildBlock(RichTextBlock)
    headline: BlockDataInterface;

    @BlockField({ type: "enum", enum: HeadlineLevel })
    level: HeadlineLevel;
}

class HeadlineBlockInput extends BlockInput {
    @IsOptional()
    @IsString()
    @BlockField({ nullable: true })
    eyebrow?: string;

    @ValidateNested()
    @ChildBlockInput(RichTextBlock)
    headline: ExtractBlockInput<typeof RichTextBlock>;

    @IsEnum(HeadlineLevel)
    @BlockField({ type: "enum", enum: HeadlineLevel })
    level: HeadlineLevel;

    transformToBlockData(): HeadlineBlockData {
        return inputToData(HeadlineBlockData, this);
    }
}

export const HeadlineBlock = createBlock(HeadlineBlockData, HeadlineBlockInput, "Headline");
