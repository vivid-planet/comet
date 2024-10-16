import { IsNotEmpty, IsString } from "class-validator";

import { BlockData, BlockInput, createBlock, inputToData } from "../../../block";
import { BlockField } from "../../../decorators/field";

class CBlockData extends BlockData {
    @BlockField()
    titleC: string;
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
