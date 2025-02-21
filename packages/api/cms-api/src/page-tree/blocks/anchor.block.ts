import { IsOptional, IsString } from "class-validator";

import { BlockData, BlockInput, blockInputToData, createBlock } from "../../blocks/block";
import { BlockField } from "../../blocks/decorators/field";

class AnchorBlockData extends BlockData {
    @BlockField({ nullable: true })
    name?: string;
}

class AnchorBlockInput extends BlockInput {
    @BlockField({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    transformToBlockData(): AnchorBlockData {
        return blockInputToData(AnchorBlockData, this);
    }
}

const AnchorBlock = createBlock(AnchorBlockData, AnchorBlockInput, "Anchor");

export { AnchorBlock };
