import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, createBlock, ExtractBlockData, ExtractBlockInput, inputToData } from "../../../blocks/block";
import { ChildBlock } from "../../../blocks/decorators/child-block";
import { ChildBlockInput } from "../../../blocks/decorators/child-block-input";
import { BlockField } from "../../../blocks/decorators/field";
import { CBlock } from "./CBlock";

class BBlockData extends BlockData {
    @BlockField()
    titleB: string;

    @ChildBlock(CBlock)
    c1: ExtractBlockData<typeof CBlock>;

    @ChildBlock(CBlock)
    c2: ExtractBlockData<typeof CBlock>;
}

class BBlockInput extends BlockInput {
    @IsString()
    @IsNotEmpty()
    @BlockField()
    titleB: string;

    @ChildBlockInput(CBlock)
    c1: ExtractBlockInput<typeof CBlock>;

    @ChildBlockInput(CBlock)
    c2: ExtractBlockInput<typeof CBlock>;

    transformToBlockData(): BBlockData {
        return inputToData(BBlockData, this);
    }
}

export const BBlock = createBlock(BBlockData, BBlockInput, "BTestBlock");
