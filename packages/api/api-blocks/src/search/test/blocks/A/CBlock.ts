import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, createBlock, inputToData } from "../../../../blocks/block";
import { BlockField } from "../../../../blocks/decorators/field";
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
        return inputToData(CBlockData, this);
    }
}

export const CBlock = createBlock(CBlockData, CBlockInput, "CTestBlock");
