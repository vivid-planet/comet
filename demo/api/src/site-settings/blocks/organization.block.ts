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
import { IsNotEmpty, IsString, IsUrl, ValidateIf } from "class-validator";

import { SameAsUrlBlock } from "./same-as-url.block";

const SameAsListBlock = createListBlock({ block: SameAsUrlBlock }, "SameAsList");

class OrganizationBlockData extends BlockData {
    @BlockField()
    name: string;

    @BlockField()
    url: string;

    @ChildBlock(DamImageBlock)
    logo: BlockDataInterface;

    @ChildBlock(SameAsListBlock)
    sameAs: BlockDataInterface;

    @BlockField()
    description: string;
}

class OrganizationBlockInput extends BlockInput {
    @BlockField()
    @IsString()
    @IsNotEmpty()
    name: string;

    @BlockField()
    @ValidateIf((input: OrganizationBlockInput) => Boolean(input.url))
    @IsUrl()
    url: string;

    @ChildBlockInput(DamImageBlock)
    logo: ExtractBlockInput<typeof DamImageBlock>;

    @ChildBlockInput(SameAsListBlock)
    sameAs: ExtractBlockInput<typeof SameAsListBlock>;

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
