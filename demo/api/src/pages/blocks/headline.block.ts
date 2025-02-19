import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    BlockWarning,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

export enum HeadlineLevel {
    HeaderOne = "header-one",
    HeaderTwo = "header-two",
    HeaderThree = "header-three",
    HeaderFour = "header-four",
    HeaderFive = "header-five",
    HeaderSix = "header-six",
}

class HeadlineBlockData extends BlockData {
    @BlockField({ nullable: true })
    eyebrow?: string;

    @ChildBlock(RichTextBlock)
    headline: BlockDataInterface;

    @BlockField({ type: "enum", enum: HeadlineLevel })
    level: HeadlineLevel;

    // This is only for testing --> Remove for PR
    warnings(): BlockWarning[] {
        if (this.eyebrow && this.eyebrow?.length < 5) {
            return [{ message: "Eyebrow is too short", severity: "critical" }];
        }
        return [];
    }
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
