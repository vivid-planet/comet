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
    infoText?: BlockDataInterface;
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
    infoText?: ExtractBlockInput<typeof RichTextBlock>;

    getBlockDataWithUpdatedFieldName(data: BaseFieldBlockInput): BaseFieldBlockInput {
        // TODO: Is `transformToBlockData` the best way to do this? (It doesn't show in the admin until the page is reloaded)
        // TODO: Handle what happens when a block with the defined `fieldName` already exists in the form
        // TODO: Handle what happens when the label is empty
        // TODO: Handle what happens when a block is copied and pasted within the same form (prevent duplicate field names)

        if (!data.fieldName) {
            const slugifiedLabel = data.label ? data.label.toLowerCase().replace(/[^a-z0-9]/g, "-") : "";
            data.fieldName = slugifiedLabel;
        }
        return data;
    }

    transformToBlockData(): BaseFieldBlockData {
        return inputToData(BaseFieldBlockData, this.getBlockDataWithUpdatedFieldName(this));
    }
}
