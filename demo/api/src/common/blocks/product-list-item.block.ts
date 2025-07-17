import {
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    inputToData,
} from "@comet/blocks-api";
import { DamImageBlock } from "@comet/cms-api";
import { IsString } from "class-validator";

class ProductListItemBlockData extends BlockData {
    @ChildBlock(DamImageBlock)
    image: BlockDataInterface;

    @BlockField()
    name: string;
}

class ProductListItemBlockInput extends BlockInput {
    @ChildBlockInput(DamImageBlock)
    image: ExtractBlockInput<typeof DamImageBlock>;

    @IsString()
    @BlockField()
    name: string;

    transformToBlockData(): ProductListItemBlockData {
        return inputToData(ProductListItemBlockData, this);
    }
}

export const ProductListItemBlock = createBlock(ProductListItemBlockData, ProductListItemBlockInput, "ProductListItem");
