import { BlockData, BlockField, BlockInput, blockInputToData, createBlock } from "@comet/cms-api";
import { IsUrl, ValidateIf } from "class-validator";

class SameAsUrlBlockData extends BlockData {
    @BlockField()
    url: string;
}

class SameAsUrlBlockInput extends BlockInput {
    @BlockField()
    @ValidateIf((input: SameAsUrlBlockInput) => Boolean(input.url))
    @IsUrl()
    url: string;

    transformToBlockData(): SameAsUrlBlockData {
        return blockInputToData(SameAsUrlBlockData, this);
    }
}

export const SameAsUrlBlock = createBlock(SameAsUrlBlockData, SameAsUrlBlockInput, {
    name: "SameAsUrl",
});
