import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock, type ExtractBlockData, type ExtractBlockInput } from "../../../../block";
import { ChildBlock } from "../../../../decorators/child-block";
import { ChildBlockInput } from "../../../../decorators/child-block-input";
import { BlockField } from "../../../../decorators/field";
import { type SearchText } from "../../../get-search-text";
import { CBlock } from "./CBlock";

class BBlockData extends BlockData {
    @BlockField()
    titleB: string;

    @ChildBlock(CBlock)
    c: ExtractBlockData<typeof CBlock>;

    searchText(): SearchText[] {
        return [this.titleB];
    }
}

class BBlockInput extends BlockInput {
    @IsString()
    @IsNotEmpty()
    @BlockField()
    titleB: string;

    @ChildBlockInput(CBlock)
    c: ExtractBlockInput<typeof CBlock>;

    transformToBlockData(): BBlockData {
        return blockInputToData(BBlockData, this);
    }
}

export const BBlock = createBlock(BBlockData, BBlockInput, "BTestBlock");
