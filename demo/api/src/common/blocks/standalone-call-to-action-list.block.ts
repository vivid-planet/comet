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
import { CallToActionListBlock } from "@src/common/blocks/call-to-action-list.block";
import { IsEnum } from "class-validator";

export enum Alignment {
    left = "left",
    center = "center",
    right = "right",
}

class StandaloneCallToActionListBlockData extends BlockData {
    @ChildBlock(CallToActionListBlock)
    callToActionList: BlockDataInterface;

    @BlockField({ type: "enum", enum: Alignment })
    alignment: Alignment;
}

class StandaloneCallToActionListBlockInput extends BlockInput {
    @ChildBlockInput(CallToActionListBlock)
    callToActionList: ExtractBlockInput<typeof CallToActionListBlock>;

    @IsEnum(Alignment)
    @BlockField({ type: "enum", enum: Alignment })
    alignment: Alignment;

    transformToBlockData(): StandaloneCallToActionListBlockData {
        return inputToData(StandaloneCallToActionListBlockData, this);
    }
}

export const StandaloneCallToActionListBlock = createBlock(StandaloneCallToActionListBlockData, StandaloneCallToActionListBlockInput, {
    name: "StandaloneCallToActionList",
});
