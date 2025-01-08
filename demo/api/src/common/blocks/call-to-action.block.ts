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
import { IsEnum } from "class-validator";

import { TextLinkBlock } from "./text-link.block";

enum Variant {
    Contained = "Contained",
    Outlined = "Outlined",
    Text = "Text",
}

class CallToActionBlockData extends BlockData {
    @ChildBlock(TextLinkBlock)
    textLink: BlockDataInterface;

    @BlockField({ type: "enum", enum: Variant })
    variant: Variant;
}

class CallToActionBlockInput extends BlockInput {
    @ChildBlockInput(TextLinkBlock)
    textLink: ExtractBlockInput<typeof TextLinkBlock>;

    @IsEnum(Variant)
    @BlockField({ type: "enum", enum: Variant })
    variant: Variant;

    transformToBlockData(): CallToActionBlockData {
        return blockInputToData(CallToActionBlockData, this);
    }
}

export const CallToActionBlock = createBlock(CallToActionBlockData, CallToActionBlockInput, "CallToAction");
