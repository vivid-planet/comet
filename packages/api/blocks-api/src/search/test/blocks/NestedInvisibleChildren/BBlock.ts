import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, createBlock, ExtractBlockData, ExtractBlockInput, inputToData } from "../../../../blocks/block";
import { ChildBlock } from "../../../../blocks/decorators/child-block";
import { ChildBlockInput } from "../../../../blocks/decorators/child-block-input";
import { BlockField } from "../../../../blocks/decorators/field";
import { SearchText } from "../../../get-search-text";
import { CBlock } from "./CBlock";

export class BBlockData extends BlockData {
    @BlockField()
    titleB: string;

    @ChildBlock(CBlock)
    c: ExtractBlockData<typeof CBlock>;

    searchText(): SearchText[] {
        return [this.titleB];
    }
}

export class BBlockInput extends BlockInput {
    @IsString()
    @IsNotEmpty()
    @BlockField()
    titleB: string;

    @ChildBlockInput(CBlock)
    c: ExtractBlockInput<typeof CBlock>;

    transformToBlockData(): BBlockData {
        return inputToData(BBlockData, this);
    }
}

export const BBlock = createBlock(BBlockData, BBlockInput, "BTestBlock");
