import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock } from "../../../../block";
import { BlockField } from "../../../../decorators/field";
import { SearchText } from "../../../get-search-text";

class CBlockData extends BlockData {
    @BlockField()
    titleC: string;

    searchText(): SearchText[] {
        return [this.titleC];
    }
}

class CBlockInput extends BlockInput {
    @IsString()
    @IsNotEmpty()
    @BlockField()
    titleC: string;

    transformToBlockData(): CBlockData {
        return blockInputToData(CBlockData, this);
    }
}

export const CBlock = createBlock(CBlockData, CBlockInput, "CTestBlock");
