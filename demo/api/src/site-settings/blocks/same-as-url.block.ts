import { BlockData, BlockField, BlockInput, blockInputToData, createBlock } from "@comet/cms-api";
import { IsUrl } from "class-validator";

class SameAsUrlBlockData extends BlockData {
    @BlockField()
    url: string;
}

class SameAsUrlBlockInput extends BlockInput {
    @BlockField()
    @IsUrl()
    url: string;

    transformToBlockData(): SameAsUrlBlockData {
        return blockInputToData(SameAsUrlBlockData, this);
    }
}

export const SameAsUrlBlock = createBlock(SameAsUrlBlockData, SameAsUrlBlockInput, {
    name: "SameAsUrl",
});
