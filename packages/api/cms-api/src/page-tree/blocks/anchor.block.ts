import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsString } from "class-validator";

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
        return inputToData(AnchorBlockData, this);
    }
}

const AnchorBlock = createBlock(AnchorBlockData, AnchorBlockInput, "Anchor");

export { AnchorBlock };
