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
} from "@comet/cms-api";
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";

import { SameAsUrlBlock } from "./same-as-url.block";

const SameAsListBlock = createListBlock({ block: SameAsUrlBlock }, "SameAsList");

class OrganizationBlockData extends BlockData {
    @BlockField()
    name: string;

    @BlockField({ nullable: true })
    url?: string;

    @ChildBlock(DamImageBlock)
    logo: BlockDataInterface;

    @ChildBlock(SameAsListBlock)
    sameAs: BlockDataInterface;

    @BlockField({ nullable: true })
    description?: string;
}

class OrganizationBlockInput extends BlockInput {
    @BlockField()
    @IsString()
    @IsNotEmpty()
    name: string;

    @BlockField({ nullable: true })
    @ValidateIf((input: OrganizationBlockInput) => Boolean(input.url))
    @IsUrl()
    url?: string;

    @ChildBlockInput(DamImageBlock)
    logo: ExtractBlockInput<typeof DamImageBlock>;

    @ChildBlockInput(SameAsListBlock)
    sameAs: ExtractBlockInput<typeof SameAsListBlock>;

    @BlockField({ nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    transformToBlockData(): OrganizationBlockData {
        return blockInputToData(OrganizationBlockData, this);
    }
}

export const OrganizationBlock = createBlock(OrganizationBlockData, OrganizationBlockInput, {
    name: "Organization",
});
