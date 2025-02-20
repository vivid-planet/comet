import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock, ExtractBlockData, ExtractBlockInput } from "../../../block";
import { ChildBlock } from "../../../decorators/child-block";
import { ChildBlockInput } from "../../../decorators/child-block-input";
import { BlockField } from "../../../decorators/field";
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
        return blockInputToData(BBlockData, this);
    }
}

export const BBlock = createBlock(BBlockData, BBlockInput, "BTestBlock");
