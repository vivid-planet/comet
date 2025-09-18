import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock, ExtractBlockData, ExtractBlockInput } from "../../../../block.js";
import { ChildBlock } from "../../../../decorators/child-block.js";
import { ChildBlockInput } from "../../../../decorators/child-block-input.js";
import { BlockField } from "../../../../decorators/field.js";
import { SearchText } from "../../../get-search-text.js";
import { BBlock } from "./BBlock.js";
import { CBlock } from "./CBlock.js";

class ABlockData extends BlockData {
    @BlockField()
    titleA: string;

    @ChildBlock(BBlock)
    b: ExtractBlockData<typeof BBlock>;

    @ChildBlock(CBlock)
    c: ExtractBlockData<typeof CBlock>;

    searchText(): SearchText[] {
        return [this.titleA];
    }
}

class ABlockInput extends BlockInput {
    @IsString()
    @IsNotEmpty()
    @BlockField()
    titleA: string;

    @ChildBlockInput(BBlock)
    b: ExtractBlockInput<typeof BBlock>;

    @ChildBlockInput(CBlock)
    c: ExtractBlockInput<typeof CBlock>;

    transformToBlockData(): ABlockData {
        return blockInputToData(ABlockData, this);
    }
}

export const ABlock = createBlock(ABlockData, ABlockInput, "ATestBlock");
