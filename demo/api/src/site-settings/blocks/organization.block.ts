import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createListBlock,
    DamImageBlock,
    ExtractBlockInput,
} from "@dextinity/cms-api";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsUrl, ValidateIf } from "class-validator";

import { SameAsUrlBlock } from "./same-as-url.block";

const SameAsUrlListBlock = createListBlock({ block: SameAsUrlBlock }, "SameAsUrlList");

class OrganizationBlockData extends BlockData {
    @BlockField()
    name: string;

    @BlockField()
    url: string;

    @ChildBlock(DamImageBlock)
    logo: BlockDataInterface;

    @ChildBlock(SameAsUrlListBlock)
    sameAs: BlockDataInterface;

    @BlockField()
    description: string;
}

class OrganizationBlockInput extends BlockInput {
    @BlockField()
    @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
    @IsString()
    @IsNotEmpty()
    name: string;

    @BlockField()
    @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
    @ValidateIf((input: OrganizationBlockInput) => Boolean(input.url))
    @IsUrl({ protocols: ["http", "https"], require_protocol: true })
    url: string;

    @ChildBlockInput(DamImageBlock)
    logo: ExtractBlockInput<typeof DamImageBlock>;

    @ChildBlockInput(SameAsUrlListBlock)
    sameAs: ExtractBlockInput<typeof SameAsUrlListBlock>;

    @BlockField()
    @IsString()
    description: string;

    transformToBlockData(): OrganizationBlockData {
        return blockInputToData(OrganizationBlockData, this);
    }
}

export const OrganizationBlock = createBlock(OrganizationBlockData, OrganizationBlockInput, {
    name: "Organization",
});
