import { BlockData, BlockField, BlockInput, blockInputToData, createBlock } from "@comet/cms-api";
import { IsArray, IsEnum } from "class-validator";

export enum Option {
    option1 = "option1",
    option2 = "option2",
    option3 = "option3",
}

class MultipleOptionsBlockData extends BlockData {
    @BlockField({ type: "string", array: true })
    options: Option;
}

class MultipleOptionsBlockInput extends BlockInput {
    @IsArray()
    @IsEnum(Option, { each: true })
    @BlockField({ type: "string", array: true })
    options: Option[];

    transformToBlockData(): MultipleOptionsBlockData {
        return blockInputToData(MultipleOptionsBlockData, this);
    }
}

export const MultipleOptionsBlock = createBlock(MultipleOptionsBlockData, MultipleOptionsBlockInput, "MultipleOptions");
