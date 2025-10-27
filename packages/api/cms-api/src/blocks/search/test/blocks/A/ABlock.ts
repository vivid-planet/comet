import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock, type ExtractBlockData, type ExtractBlockInput } from "../../../../block";
import { ChildBlock } from "../../../../decorators/child-block";
import { ChildBlockInput } from "../../../../decorators/child-block-input";
import { BlockField } from "../../../../decorators/field";
import { type SearchText } from "../../../get-search-text";
import { BBlock } from "./BBlock";
import { CBlock } from "./CBlock";

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
