import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { IsUndefinable } from "@comet/cms-api";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { IsBoolean, IsString } from "class-validator";

export class BaseFieldBlockData extends BlockData {
    @BlockField({ nullable: true })
    label?: string;

    @BlockField({ nullable: true })
    fieldName?: string;

    @BlockField()
    mandatory: boolean;

    @ChildBlock(RichTextBlock)
    helperText?: BlockDataInterface;
}

export class BaseFieldBlockInput extends BlockInput {
    @IsString()
    @IsUndefinable()
    @BlockField({ nullable: true })
    label?: string;

    @IsString()
    @IsUndefinable()
    @BlockField({ nullable: true })
    fieldName?: string;

    @IsBoolean()
    @BlockField()
    mandatory: boolean;

    @ChildBlockInput(RichTextBlock)
    helperText?: ExtractBlockInput<typeof RichTextBlock>;

    transformToBlockData(): BaseFieldBlockData {
        return inputToData(BaseFieldBlockData, this);
    }
}
