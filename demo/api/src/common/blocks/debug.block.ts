import { BlockData, BlockField, BlockInput, createBlock, inputToData } from "@comet/blocks-api";
import { IsOptional, IsString } from "class-validator";

class DebugBlockData extends BlockData {
    @BlockField()
    title: string;
}

class DebugBlockInput extends BlockInput {
    @IsString()
    @IsOptional()
    @BlockField({ nullable: true })
    title?: string;

    transformToBlockData(): DebugBlockData {
        return inputToData(DebugBlockData, this);
    }
}

export const DebugBlock = createBlock(DebugBlockData, DebugBlockInput, "Debug");
