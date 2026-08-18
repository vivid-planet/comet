import { BlockData, BlockField, BlockInput, blockInputToData, createBlock } from "@dextinity/cms-api";
import { Transform } from "class-transformer";
import { IsUrl, ValidateIf } from "class-validator";

class SameAsUrlBlockData extends BlockData {
    @BlockField()
    url: string;
}

class SameAsUrlBlockInput extends BlockInput {
    @BlockField()
    @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
    @ValidateIf((input: SameAsUrlBlockInput) => Boolean(input.url))
    @IsUrl()
    url: string;

    transformToBlockData(): SameAsUrlBlockData {
        return blockInputToData(SameAsUrlBlockData, this);
    }
}

export const SameAsUrlBlock = createBlock(SameAsUrlBlockData, SameAsUrlBlockInput, {
    name: "SameAsUrl",
});
